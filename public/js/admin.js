
$(co.wrap(function *() {

    $('#formKp').submit(function () {
        var form = $(this);
        $('.error', form).html('');
        $('.submit', form).html('loading');
        $.ajax({
            url: '/admin',
            method: 'POST',
            data: form.serialize(),
            complete: function () {
                // $('.submit', form).html('reset');
            },
            statusCode: {
                200: function () {
                    $('.error', form).html('Данные сохранены');
                    alert('Данные сохранены');
                },
                403: function (jqXHR) {
                    var error = JSON.parse(jqXHR.responseText);
                    $('.error', form).html(error.message)
                }
            }
        });
        return false;

    });
    
    $('#formKpDel').submit(function () {
        var form = $(this);
        $('.error', form).html('');
        $('.submit', form).html('loading');
        $.ajax({
            url: '/admin/delkp',
            method: 'POST',
            data: form.serialize(),
            complete: function () {
                // $('.submit', form).html('reset');
            },
            statusCode: {
                200: function () {
                    $('.error', form).html('Данные сохранены');
                    alert('КП удалено');
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

