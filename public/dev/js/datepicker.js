(function($) {
	$("#datepicker").datepicker({ 
		dateFormat: "dd/mm/yy",
		minDate: 1,
		maxDate: "+1M + 31D" 
	});
})(jQuery);
