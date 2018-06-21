// getElementById
function $id(id) {
	return document.getElementById(id);
}

$('#tokens').on("keyup",function(){
	var eth = $id('eth');
	var token_price_element = $id('token_price');

	var token_price = parseFloat(token_price_element.innerHTML);

	var eth_total = token_price * $('#tokens').val();

	$('#eth').val(eth_total);
});

$('#eth').on("keyup",function(){
	var eth = $id('eth');
	var token_price_element = $id('token_price');

	var token_price = parseFloat(token_price_element.innerHTML);

	var token_total = $('#eth').val() / token_price;

	token_total = token_total.toFixed(5);

	$('#tokens').val(token_total);
});

$('#buynow_btn').on("click",function(){
	$('#buynow_btn').css('display', 'none');
	$('#loading_gif').css('display', 'block');

	  $( "#loading_gif" ).animate({
	    display: "block"
	  }, {
	    duration: 4000,
	    complete: function() {
	        $( this ).css('display','none');
	        $( "#complete_img" ).css('display', 'block');
	    }
	  });
});

$('#withdraw_btn').on("click",function(){
	$('#withdraw_btn').css('display', 'none');
	$('#withdraw_loading_gif').css('display', 'block');

	  $( "#withdraw_loading_gif" ).animate({
	    display: "block"
	  }, {
	    duration: 4000,
	    complete: function() {
	        $( this ).css('display','none');
	        $( "#withdraw_complete_img" ).css('display', 'block');
	    }
	  });
});

$('#stop_btn').on("click",function(){
	$('#stop_btn').css('display', 'none');
	$('#stop_loading_gif').css('display', 'block');

	  $( "#stop_loading_gif" ).animate({
	    display: "block"
	  }, {
	    duration: 4000,
	    complete: function() {
	        $( this ).css('display','none');
	        $( "#stop_complete_img" ).css('display', 'block');
	    }
	  });
});