// Trigger error message
function triggerErrorMessage(){
    $(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
}

$('#token-form').submit(function (e) { 

	var token_name = $('input#token_name').val();
	var token_decimal = $('input#token_decimals').val();
	var token_symbol = $('input#token_symbol').val();
	var owner_address = $('input#owner_address').val();

	// If any required fields are missing, return appropriate error message 
  	if (!token_name || !token_symbol || !token_decimal || !owner_address) {
  		$('.error').html('All fields marked with * are required!');
  		triggerErrorMessage();
    	return false;
  	}

  	// If symbol is wrong length, return appropriate error message 
  	if(token_symbol.length > 4 || token_symbol.length < 3 ){
  		$('.error').html('Token symbol must be 3-4 characters long');
  		triggerErrorMessage();
    	return false;
  	}

  	// If token decimals are incorrect, return appropriate error message
  	if(token_decimal > 18 || token_decimal < 0 ){
  		$('.error').html('Token decimals must be a positive number below 18');
  		triggerErrorMessage();
    	return false;
  	}

});