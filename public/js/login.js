
$(co.wrap(function *() {

    $('#login').submit(function () {
        var form = $(this);
        $('.error', form).html('');
        $('.submit', form).html('loading');
        $.ajax({
            url: '/login#fff',
            method: 'POST',
            data: form.serialize(),
            complete: function () {
                $('.submit', form).html('reset');
            },
            statusCode: {
                200: function () {
                    form.html('Вы вошли на сайт');
                    window.location.href = '/chat'
                },
                403: function (jqXHR) {
                    var error = JSON.parse(jqXHR.responseText);
                    $('.error', form).html(error.message)
                }
            }
        });
        return false;

    });

    $('#registration').submit(function () {
        var form = $(this);
        $('.error', form).html('');
        $('.submit', form).html('loading');
        $.ajax({
            url: '/registration',
            method: 'POST',
            data: form.serialize(),
            complete: function () {
                $('.submit', form).html('reset');
            },
            statusCode: {
                200: function () {
                    form.html('Вы вошли на сайт');
                    window.location.href = '/chat'
                },
                403: function (jqXHR) {
                    var error = JSON.parse(jqXHR.responseText);
                    $('.error', form).html(error.message)
                }
            }
        });
        return false;
    });
    
}));
