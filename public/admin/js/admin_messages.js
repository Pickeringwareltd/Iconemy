(function ($) {
  // USE STRICT
  "use strict";

  try {
    
    $('[data-toggle="tooltip"]').tooltip();

  } catch (error) {
    console.log(error);
  }

  // Chatbox
  try {
    var inbox_wrap = $('.js-inbox');
    var message = $('.au-message__item');
    message.each(function(){
      var that = $(this);

      that.on('click', function(){
        var message_sender = $(this)[0].children[0].children[0].children[0].firstElementChild.innerText;
        var message_text = $(this)[0].children[0].children[0].children[0].lastElementChild.innerText;
        var message_time = $(this)[0].children[0].children[1].innerText;
        var message_email = $(this)[0].dataset.email;
        var message_id = $(this)[0].dataset.id;
        var responded = $(this)[0].dataset.responded;

        $('#js_chat_text')[0].innerText = message_text;
        $('#js_chat_name')[0].innerText = message_sender;
        $('#js_chat_time')[0].innerText = message_time;
        $('#js_chat_email')[0].innerText = message_email;

        if(responded == 'true'){
          $('#message_respond_form').css('display', 'none');
        } else {
          $('#message_respond_form').attr('action', '/admin/messages/' + message_id);
          $('#message_respond_form').attr('method', 'post');
        }

        $(this).parent().parent().parent().toggleClass('show-chat-box');
      });

    });
  } catch (error) {
    console.log(error);
  }

})(jQuery);