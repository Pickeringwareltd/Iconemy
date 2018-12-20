$(function() {
    var $signupForm = $('#js-signup-form');

    $signupForm.on('submit', function(e) {
        e.preventDefault();
        $('#js-errors').addClass('d-none');
        $signupForm.find('button').text('Working...').attr('disabled', true);

        var elems = $signupForm.serializeArray();

        $.post('/api/register', $signupForm.serializeArray(), function(response) {
            if (! response.success) {

                $('#js-errors').removeClass('d-none');
                $('#js-errors ul').html('<li>'+response.errors.join('</li><li>')+'</li>');

                $signupForm.find('button').text('Log in').attr('disabled', false);
            } else {
                $signupForm.trigger('reset');
                $('#js-success').slideDown();

                var origin   = window.location.origin; 
                window.location.replace(origin + '/ico/dashboard/confirm');
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

        var $username = $('#username_form').val();
        var $password = $('#password_form').val();

        var login_array = {
            'username': $username,
            'password': $password
        };
        
        $.post('/api/login', login_array, function(response) {


            if (! response.success) {
                $('#js-errors').removeClass('d-none');
                $('#js-errors ul').html('<li>'+response.message+'</li>');

                $loginForm.find('button').text('Log In').attr('disabled', false);
            } else {
                window.location.replace(window.location.origin + '/listing');
            }
        }).fail(function(response) {
            $loginForm.find('button').text('Log In').attr('disabled', false);
        });
    });
});