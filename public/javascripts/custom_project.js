$('.buynow_section').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/sale'
});

$('.tokens').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/token'
});

$('#new_crowdsale').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/sale/create'
});

$('.crowdsale').on("click",function(){
	var index = $(this).attr('data-index');

	// Re-direct to new project form
	window.location.href = '/crowdsales/' + index;
});

$('#submit_btn').on("click",function(){
	// Re-direct to new project form
	window.location.href = '/pay'
});