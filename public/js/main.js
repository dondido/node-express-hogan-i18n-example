(function($) {
	var $document = $(document),
	initialNavigation = true,
	defaultPath = location.pathname;
	
	$document.on({
		"dataPageRefresh": this.updatePage,
		"uiNavigate": this.navigateUsingPushState,
		"click": this.navigate,
		"uiPageChanged": this.setTitle
	});
	
	$(window).on({
		"beforeunload": this.destroyState,
		"popstate": this.onPopState
	});
	
	/* This HTML is only a fragment of the full page and
	substituted with the requested page's content.*/
	this.updatePage = function(e, data) {
		var cl;
		if ('cssList' in data){
			for (cl in data.cssList){
				$('head').append('<link href="/css/' + data.cssList[cl] + '.css" rel="stylesheet" />');
			}
		}
		$("#yield").html(data.html);
		$("#main-nav").removeClass().addClass(data.navSelector);
	};

	/* The trick with the AJAX request is that when it is made
	a property 'x-requested-with' is added to the HTTP header. 
	See req.headers['x-requested-with'].indexOf('XMLHttpRequest') in server.js. 
	By looking for this request our server knows whether to return JSON 
	response with a property that holds the html fragment that applies to this
	specific content or to return the entire HTML document. */
	this.requestJSON = function(data) {
		$.ajax({
			url: data.url,
			//dataType: 'json',
			success: function(resp) {
				/* History API will only get populated if the request is not made
				using onPopState event listener(forward or backward browser navigation). */
				data.pushState && history.pushState({url: resp.url}, resp.title, resp.url);
				$(document).trigger('dataPageRefresh', resp);
			},
			error: function(req, status, err) {
				console.log('something went wrong', status, err);
			}
		});
	}

	/* The beauty of this method is that it requires very little change to our application
	and we can share url routes with both the client and the server. Additionally, because
	it uses the HTML5 history API we don't have to use hash/hashbanged urls. Lastly, since 
	progressive enhancement is applied, any browser that is not compatible with this approach
	will just default to normal HTTP requests. This basically means that support for browsers
	which have javascript disabled is fully provided. */
	this.navigateUsingPushState = function(e, href) {
		var currentState = {
			navSelector: $("#main-nav")[0].className,
			html: $("#yield").html()
		};
		if (initialNavigation) {
			history.replaceState(currentState, "Home", defaultPath);
			initialNavigation = false;
		}
		requestJSON({pushState: 1, url: href});
	};
	
	/*
	The first request to the server is always a normal request. The server then returns
	the page in the normal fashion - rendered entirely on the server side.
	All other subsequent requests are XMLHttpRequest. For example, if a user clicks on a 
	link that opens the /contacts page the client-side JavaScript makes a request for only
	the parts of the page that need to change. The server then generates JSON with html of
	the only the changed content as a proprty and returns it in the response.
	*/
	this.navigate = function(e) {
		var $target, href, $link;
		if (e.shiftKey || e.ctrlKey || e.metaKey || (e.which != undefined && e.which > 1)) {
			return;
		}
		$target = $(e.target);
		$link = $target.closest('.js-nav');
		if ($link.length && !e.isDefaultPrevented()) {
			href = $link.attr('href');
			if (href != location.pathname || defaultPath != href) {
				e.preventDefault();
				$link.trigger('uiNavigate', href);
			}
		}
	};

	this.setTitle = function(e, data) {
		var state = data || e.originalEvent.state;
		if (state) {
			document.title = state.title;
		}
	};

	this.onPopState = function(e) {
		/* Replaces the old content with the new content from browser's cache. */
		if (e.state) {
			// Update state
			if (e.state.url) {
				requestJSON({pushState: 0, url: e.state.url})
			} else {
				updatePage(e, e.state)
			}
		}
	};
	
	/*
	adds a listener for the “beforeunload” event that uses replaceState to remove the state 
	associated with the current URL. This way when the user hits the back button, the 
	“popstate” event will ﬁre with a “state” property of null, and the aforementioned 
	“popstate” event listener will just ignore it.
	*/
	this.destroyState = function (e) {
 		history.replaceState(null, document.title, window.location.href);
	};

})(jQuery);
