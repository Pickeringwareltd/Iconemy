'use strict';

$('#signup_btn').on("click",function(){
  var email = $('#email_input').val();
  var page = $('#email_input').attr('data-page');
  var url = getDomain() + "/api/subscribe";
  subscribe(url, page, email, false);
});

$('#signup_btn_mid').on("click",function(){
  var email = $('#email_input_mid').val();
  var page = $('#email_input_mid').attr('data-page');
  var url = getDomain() + "/api/subscribe";
  subscribe(url, page, email, true);
});

$('#form_submit_btn').on("click",function(){
  var name = $('#form_name').val();
  var page = $('#form_name').attr('data-page');
  var email = $('#form_email').val();
  var message = $('#form_message').val();

  var url = getDomain() + "/api/contact";

  contact(url, name, email, message, page);
});

function subscribe(_url, _page, _email, _mid){
    var to_send = {
        email: _email,
        page: _page
    };

    $.ajax({
      method: 'POST',
      url: _url,
      data: to_send
    }).done(function(response) {
      if(_mid){
        showMidSuccessMessage(response);
      } else{
        showSuccessMessage(response);
      }
    }).fail(function(res) {
      var obj = JSON.parse(res.responseText);
      if(_mid){
        showMidErrorMessage(obj);
      } else {
        showErrorMessage(obj);
      }
    });
}

function contact(_url, _name, _email, _message, _page){
    var to_send = {
        email: _email,
        name: _name,
        message: _message,
        page: _page
    };

    $.ajax({
      method: 'POST',
      url: _url,
      data: to_send
    }).done(function(response) {
        showContactSuccessMessage(response);
    }).fail(function(res) {
        var obj = JSON.parse(res.responseText);
        showContactErrorMessage(obj);
    });
}

function showMidSuccessMessage(obj){
    $('#success_message_mid').html(obj.message);
    $('#success_box_mid').fadeIn("slow");
    $("#success_box_mid").delay(3000).fadeOut("slow")
}

function showMidErrorMessage(obj){
    $('#error_message_mid').html(obj.message);
    $('#error_box_mid').fadeIn("slow");
    $("#error_box_mid").delay(3000).fadeOut("slow")
}

function showSuccessMessage(obj){
    $('#success_message').html(obj.message);
    $('#success_box').fadeIn("slow");
    $("#success_box").delay(3000).fadeOut("slow")
}

function showErrorMessage(obj){
    $('#error_message').html(obj.message);
    $('#error_box').fadeIn("slow");
    $("#error_box").delay(3000).fadeOut("slow")
}

function showContactSuccessMessage(obj){
    $('#form_success_message').html(obj.message);
    $('#form_success_box').fadeIn("slow");
    $("#form_success_box").delay(3000).fadeOut("slow")
}

function showContactErrorMessage(obj){
    $('#form_error_message').html(obj.message);
    $('#form_error_box').fadeIn("slow");
    $("#form_error_box").delay(3000).fadeOut("slow")
}

function getDomain(){
  var hostname = window.location.hostname;
  var protocol = window.location.protocol;
  var url;

  if(hostname == 'localhost'){
    url = protocol + '//' + hostname + ':' + window.location.port;
  } else {
    url = protocol + '//' + hostname;
  }

  return url;
}
