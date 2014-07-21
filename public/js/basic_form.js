(function($) {
	var $document = $(document),
	// variable to hold request
	req;
	
	this.resetForm = function(){
		// reenable the inputs
		$inputs.prop("disabled", false);
		$(submit-states).removeClass("active");
	};
	
	this.submitForm = function(e){
		var $form = $(this),
		emailstatus = '#subnit-fail';
		/* Get some values from elements on the page: */
    		var postData = $form.serializeArray();
    		// let's select and cache all the fields
    		var $inputs = $form.find("input, select, button, textarea");


		// let's disable the inputs for the duration of the ajax request
	        // Note: we disable elements AFTER the form data has been serialized.
	        // Disabled form elements will not be serialized.
	        $inputs.prop("disabled", true);
		
		// fire off the request to the node server
    		req = $.ajax(
		{
		        type: "POST",
		        data : postData,
			success: function(resp) {
				console.log("resp",resp);
			},
			error: function(req, status, err) {
				console.log('something went wrong', status, err);
			}
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
	
	$document.on("submit","form", this.submitForm);

})(jQuery);
