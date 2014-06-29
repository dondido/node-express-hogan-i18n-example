(function($){
	var $document = $(document);
	
	this.updatePage = function(e, data) {
		$(data.viewContainer).html(data.page);
		using(data.module, function(page) {
			page(data.init_data);
			$(document).trigger('uiPageChanged', [data]);
		}.bind(this));
	};
	$(document).on('dataPageRefresh', this.updatePage);
	
	this.navigateUsingPushState = function (e, data) {
		var initialNavigation = true;
		var state = this.initialState;
 
		if (initialNavigation) {
			state.page = $(state.viewContainer).html();
			history.replaceState(state, state.title, state.url);
			initialNavigation = false;
		}
		
		$.ajax({
			url: data.href,
			dataType: 'json',
			type: 'GET',
			success: function(resp) {
				history.pushState(resp, resp.title, resp.url);
				$(document).trigger('dataPageRefresh', [resp]);
			} 
		});
	};
	$document.on('uiNavigate', this.navigateUsingPushState);
	
	this.navigate = function(e) {
		var $target,
		$link;
		
		if (e.shiftKey || e.ctrlKey || e.metaKey || (e.which != undefined && e.which > 1)) {
			return;
		}
		
		$target = $(e.target);
		$link = $target.closest('.js-nav');
		
		if ($link.length && !e.isDefaultPrevented()) {
			e.preventDefault();
			$link.trigger('uiNavigate', [{ href: $link.attr('href') }])
		}
	};
	
	$document.on("click", this.navigate);
	
	this.setTitle = function(e, data) {
		var state = data || e.originalEvent.state;
		if (state) {
			document.title = state.title;
		}
	};
	$(document).on('uiPageChanged', this.setTitle);
	
})(jQuery);
