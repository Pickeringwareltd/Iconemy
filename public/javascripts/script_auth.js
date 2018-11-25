$(function() {
    var $signupForm = $('#js-signup-form');

    $signupForm.on('submit', function(e) {
        e.preventDefault();
        $('#js-errors').addClass('d-none');
        $signupForm.find('button').text('Working...').attr('disabled', true);

        $.post('/api/register', $signupForm.serializeArray(), function(response) {
            if (! response.success) {
                $('#js-errors').removeClass('d-none');
                $('#js-errors ul').html('<li>'+response.errors.join('</li><li>')+'</li>');

                $signupForm.find('button').text('Working...').attr('disabled', true);
            } else {
                $signupForm.trigger('reset');
                $('#js-success').slideDown();
            }
        }).fail(function(response) {
            $loginForm.find('button').text('Log In').attr('disabled', false);
        });
    });

    var $loginForm = $('#js-login-form');

    $loginForm.on('submit', function(e) {
        e.preventDefault();
        $('#js-errors').addClass('d-none');

        $loginForm.find('button').text('Working...').attr('disabled', true);

        $.post('/api/login', $loginForm.serializeArray(), function(response) {

            if (! response.success) {
                $('#js-errors').removeClass('d-none');
                $('#js-errors ul').html('<li>'+response.message+'</li>');

                $loginForm.find('button').text('Log In').attr('disabled', false);
            } else {
                window.location.reload();
            }
        }).fail(function(response) {
            $loginForm.find('button').text('Log In').attr('disabled', false);
        });
    });
});