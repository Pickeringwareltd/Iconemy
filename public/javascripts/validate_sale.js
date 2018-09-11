'use strict';

// Trigger error message
function triggerErrorMessage(){
    $(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
}

$('#token-form').submit(function (e) { 

	var sale_name = $('input#sale_name').val();
	var sale_starttime = $('input#start_time').val();
	var sale_endtime = $('input#end_time').val();
	var initial_price = $('input#token_price').val();
  var commission = $('input#commission_selector').val();
  var admin = $('input#admin_wallet').val();
  var beneficiary = $('input#beneficiary_wallet').val();

	  // If any required fields are missing, return appropriate error message 
  	if (!sale_name || !sale_starttime || !sale_endtime || !initial_price || !commission || !admin || !beneficiary) {
  		$('.error').html('All fields marked with * are required!');
  		triggerErrorMessage();
    	return false;
  	}

  	// If symbol is wrong length, return appropriate error message 
  	if(commission < 1 || commission > 5 ){
  		$('.error').html('Commission must be between 1% and 5%');
  		triggerErrorMessage();
    	return false;
  	}

});