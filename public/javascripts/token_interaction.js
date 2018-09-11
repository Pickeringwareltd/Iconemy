'use strict';

$('#release_btn').on("click",function(){
	$('#release_btn').css('display', 'none');
	$('#release_loading_gif').css('display', 'block');

	  $( "#release_loading_gif" ).animate({
	    display: "block"
	  }, {
	    duration: 4000,
	    complete: function() {
	        $( this ).css('display','none');
	        $( "#release_complete_img" ).css('display', 'block');
	    }
	  });
});


$('#mint_btn').on("click",function(){
	$('#mint_btn').css('display', 'none');
	$('#mint_loading_gif').css('display', 'block');

	  $( "#mint_loading_gif" ).animate({
	    display: "block"
	  }, {
	    duration: 4000,
	    complete: function() {
	        $( this ).css('display','none');
	        $( "#mint_complete_img" ).css('display', 'block');
	    }
	  });
});