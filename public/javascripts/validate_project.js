'use strict';

// Trigger error message
function triggerErrorMessage(){
    $(".error-message").delay(1000).slideDown(1000).delay(3000).slideUp(500);
}

$('#token-form').submit(function (e) { 

	var project_name = $('input#sale_name').val();
	var description = $('textarea#description').val();
	var website = $('input#website').val();
	var whitepaper = $('input#whitepaper').val();
  var onepager = $('input#onepager').val();
  var subdomain = $('input#subdomain').val();

  // Must extract subdomain from iconemy URL
  var index = subdomain.search(' ');
  subdomain = subdomain.substring(0, index);

  var facebook = $('input#facebook_input').val();
  var twitter = $('input#twitter_input').val();
  var youtube = $('input#youtube_input').val();
  var medium = $('input#medium_input').val();
  var bitcoin = $('input#bitcoin_input').val();
  var telegram = $('input#telegram_input').val();

	// If any required fields are missing, return appropriate error message 
  if (!project_name || !description || description == 'Enter a basic description about your project here' || !website || !subdomain || subdomain == '    .iconemy.io') {
  	$('.error').html('All fields marked with * are required!');
  	triggerErrorMessage();
    return false;
  }

  if(!website.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)){
    $('.error').html('Must enter a valid web address!');
    triggerErrorMessage();
    return false;
  }

  /* 
   * There are various rules surrounding subdomains:
   * One sub-domain allowed
   * Subdomain begins with alpha-num.
   * Optionally more than one char.
   * Middle part may have dashes.
   * Starts and ends with alpha-num.
   * Subdomain length from 1 to 63.
   * See https://stackoverflow.com/questions/7930751/regexp-for-subdomain for more details.
  */
  if(subdomain.match(/^[a-z0-9]{0,63}$/) == null){
    $('.error').html('Your subdomain can only include lowercase characters and numbers');
    triggerErrorMessage();
    return false;
  }

  // All useful regexs come from https://github.com/lorey/social-media-profiles-regexs
  if(facebook != '' && facebook.match(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/) == null){
    $('.error').html('Must enter a valid Facebook URL');
    triggerErrorMessage();
    return false;
  }

  if(twitter != '' && !twitter.match(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9(\.\?)?]/) == null){
    $('.error').html('Must enter a valid Twitter URL');
    triggerErrorMessage();
    return false;
  }

  if(youtube != '' && !youtube.match(/^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/) == null){
    $('.error').html('Must enter a valid Youtube URL');
    triggerErrorMessage();
    return false;
  }

  if(medium != '' && !medium.match(/^(https?:\/\/)?(www\.)?medium.com\/@?[a-zA-Z0-9(\.\?)?]+/) == null){
    $('.error').html('Must enter a valid Medium URL');
    triggerErrorMessage();
    return false;
  }

  if(bitcoin != '' && !bitcoin.match(/^(https?:\/\/)?(www\.)?bitcointalk.org\/[a-zA-Z0-9(\.\?)?]/) == null){
    $('.error').html('Must enter a valid Bitcointalk URL');
    triggerErrorMessage();
    return false;
  }

  if(telegram != '' && telegram.match(/https?:\/\/(t(elegram)?\.me|telegram\.org)\/([a-zA-Z0-9\_]{5,32})\/?/) == null){
    $('.error').html('Must enter a valid Telegram URL');
    triggerErrorMessage();
    return false;
  }

});