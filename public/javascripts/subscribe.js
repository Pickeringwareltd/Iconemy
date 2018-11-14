'use strict';

$('#signup_btn').on("click",function(){

  var email = $('#email_input').val();
  var page = $('#email_input').attr('data-page');
  var url = getDomain() + "/subscribe";
  subscribe(url, page, user_email);
});

function subscribe(_url, _page, _email){
    var to_send = {
        email: _email,
        page: _page
    };

    $.ajax({
      method: 'POST',
      url: _url,
      data: "json=" + escape(JSON.stringify(to_send))
    }).done(function(response) {

      console.log('done');

    });
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
