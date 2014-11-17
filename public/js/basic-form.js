(function($) {
	var $document = $(document),
		removePage = function(){
			$document.off("submit", "form", submitForm)
		},
		submitForm = function(e){
			var $form = $(this),
				req,// variable to hold request
				emailstatus = 'submit-fail',
	    		// let's select and cache all the fields
	    		$inputs = $form.find("input, select, button, textarea");

	    		// show message while waiting for the ajax responce
	    		$form.addClass("submit-pending");

			// fire off the request to the node server
	    	req = $.ajax({
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
				$("#reset-form").one('click', function(){
					$form.removeClass(emailstatus);
					// reenable the inputs
					$inputs.prop("disabled", false);
				});
				$form
					.removeClass("submit-pending")
					.addClass(emailstatus);
			});

			// let's disable the inputs for the duration of the ajax request
	        // Note: we disable elements AFTER the form data has been serialized.
	        // Disabled form elements will not be serialized.
	        $inputs.prop("disabled", true);

			// prevent default posting of form
			e.preventDefault();
		};
	
	$document.on("submit", "form", submitForm)
		.one("dataPageRefresh", removePage);
	
})(jQuery);