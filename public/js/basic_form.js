(function($) {
	var $document = $(document),
	$inputs;
	
	var resetForm = function(){
		// reenable the inputs
		$inputs.prop("disabled", false);
		$("submit-states").removeClass("active");
	};
	
	var removePage = function(){
		toggleListeners("off");
	};
	
	var submitForm = function(e){
		var $form = $(this),
		req,// variable to hold request
		emailstatus = '#submit-fail';
    		// let's select and cache all the fields
    		$inputs = $form.find("input, select, button, textarea");

		// let's disable the inputs for the duration of the ajax request
	        // Note: we disable elements AFTER the form data has been serialized.
	        // Disabled form elements will not be serialized.
	        $inputs.prop("disabled", true);
		
		// fire off the request to the node server
    		req = $.ajax(
		{
		        type: "POST",
		        data : $form.serializeArray()
		});

		// callback handler that will be called on success
		req.done(function (res, textStatus, jqXHR){
			emailstatus = res.emailstatus;
		});

		// callback handler that will be called on failure
		req.fail(function (jqXHR, textStatus, errorThrown){
			// log the error to the console
			console.error("The following error occured: " + textStatus, errorThrown);
		});

		// callback handler that will be called regardless
		// if the request failed or succeeded
		req.always(function () {
			$("#reset-form").click(resetForm);
			$(emailstatus).addClass("active");
		});

		// prevent default posting of form
		e.preventDefault();
	}
	
	var toggleListeners = function (binder){
	        $document[binder]("submit","form", submitForm)
			[binder]("dataPageRefresh", removePage);
	}
	
	toggleListeners("on");
	
})(jQuery);
