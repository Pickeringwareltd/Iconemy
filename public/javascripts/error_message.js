'use strict';

// Trigger error message
function triggerErrorMessage(){
    $(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
}

$( document ).ready(function() {
	if($('.error').html() != ''){
		triggerErrorMessage();
	}
});