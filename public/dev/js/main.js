(function($, document) {
	var $document = $(document),
	initialNavigation = true,
	$html,
	$head,
	$yield,
	$navBtn,
	$mainNav,
	defaultLanguage,
	defaultState,
	defaultTitle,
	defaultPath;

	var init = function(){
		if (history.pushState){
			$head = $("head");
			$yield = $("#yield");
			$mainNav = $("#main-nav");
			$navBtn = $("#navbar-checkbox");
			$html = $("html");
			$html.removeClass("no-js");

			$document.on(
				{
					"dataPageRefresh": updatePage,
					"uiNavigate": navigateUsingPushState
				}
			).on("click", ".js-nav", navigate);
			$(window).on("popstate", onPopState);
		};
	};
	/* This HTML is only a fragment of the full page and
	substituted with the requested page's content.*/
	var updatePage = function(e, data) {
		var cl;
		if ('cssList' in data){
			for (cl in data.cssList){
				$head.append('<link href="/css/' + data.cssList[cl] + '.css" rel="stylesheet" />');
			}
		}
		document.title = data.title || document.title;
		$yield.html(data.html);
		$mainNav.removeClass().addClass(data.navSelector);
	};

	/* The trick with the AJAX request is that when it is made
	a property 'x-requested-with' is added to the HTTP header. 
	See req.headers['x-requested-with'].indexOf('XMLHttpRequest') in server.js. 
	By looking for this request our server knows whether to return JSON 
	response with a property that holds the html fragment that applies to this
	specific content or to return the entire HTML document. */
	var requestJSON = function(data) {
		$.ajax(
			{
				/* Preventing browsers from displaying ajax response when 
				normal HTTP request is made and the back button pressed:
				AJAX requests use a different URL from the full HTML documents. 
				Most browsers cache the most recent request even if it is just a partial. */
				url: data.url + "-ajax",
				//dataType: 'json',
				success: function(resp) {
					var url = resp.url.replace("-ajax", "")
					/* History API will only get populated if the request is not made
					using onPopState event listener(forward or backward browser navigation). */
					if (data.pushState) {
						history.pushState({url: url}, resp.title, url);
					}
					$document.trigger('dataPageRefresh', resp);
				},
				error: function(req, status, err) {
					console.log('Something went wrong', status, err);
				}
			}
		);
	};

	/* The beauty of this method is that it requires very little change to our application
	and we can share url routes with both the client and the server. Additionally, because
	it uses the HTML5 history API we don't have to use hash/hashbanged urls. Lastly, since 
	progressive enhancement is applied, any browser that is not compatible with this approach
	will just default to normal HTTP requests. This basically means that support for browsers
	which have javascript disabled is fully provided. */
	var navigateUsingPushState = function(e, href) {
		
		if (initialNavigation) {
			defaultLanguage = $html.attr("lang");
			defaultTitle = document.title;
			defaultPath = location.pathname + (
				location.pathname.indexOf(defaultLanguage) === -1 ? defaultLanguage: "" );
			defaultState = {
				navSelector: $mainNav[0].className,
				title: document.title,
				html: $yield.html()
			}
			history.replaceState(defaultState, defaultTitle, defaultPath);
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
	var navigate = function(e) {
		var href;
		if (e.shiftKey || e.ctrlKey || e.metaKey || (e.which !== undefined && e.which > 1)) {
			return;
		}
		href = $(this).attr('href');
		if (href !== location.pathname) {
			e.preventDefault();
			if (defaultPath === href){
				history.pushState(defaultState, defaultTitle, defaultPath);
				updatePage(e, defaultState);
			} else {
				navigateUsingPushState(e, href);
				// contracts expanded vertical menu 
				$navBtn[0].checked = false;
			} 
		}
	};

	var onPopState = function(e) {
		/* Replaces the old content with the new content from browser's cache. */
		var state = e.originalEvent.state;
		if (state) {
			// Update state
			if (state.url) {
				requestJSON({pushState: 0, url: state.url});
			} else {
				updatePage(e, state);
			}
		}
	};

	$document.one("ready", init);

})(jQuery, document);