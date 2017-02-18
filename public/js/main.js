var socket = io.connect();

$(co.wrap(function *() {

    $('#login').submit(function () {
        var form = $(this);
        $('.error', form).html('');
        $('.submit', form).html('loading');
        $.ajax({
            url: '/login',
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


    var sendPanelForm = $('#send-panel-form'),
        input = $(this).find('.send-panel-text'),
        inputKp = $(this).find('.send-panel-kp'),
        messagesWrap = $('#messages-wrap');
    scrollTop('#messages-wrap');


    var messageTmpl = yield new Promise((resolve, reject) => $.get('/partials/message.hbs', function (html) {
        resolve(Handlebars.compile(html))
    }));

    sendPanelForm.submit(co.wrap(function *(e) {
        // sendMessage();
        var text = input.val();
        var kp = inputKp.val();
        input.val('');
        inputKp.val('');
        // console.log(text);
        var message = {
            text: text,
            kp: kp
        };
        e.preventDefault();
        var position = yield  new Promise(resolve => navigator.geolocation.getCurrentPosition(function (position) {
            resolve(position)
        }));

        // console.log(position.coords.latitude);

        if ($('#send-panel-n').val() && $('#send-panel-n').val()) {
            message.n = $('#send-panel-n').val();
            message.e = $('#send-panel-e').val();
        }

        socket.emit('message', message);

        return false
    }));

    $('#send-panel-sos').click(co.wrap(function *(e) {

        e.preventDefault();

        var position = yield  new Promise(resolve => navigator.geolocation.getCurrentPosition(function (position) {
            resolve(position)
        }));

        $('#send-panel-n').val(position.coords.latitude);
        $('#send-panel-e').val(position.coords.longitude);

    }));


    socket
        .on('message', function (messageObj) {
            // console.log(messageObj);
            printMessage(messageObj)
        })
        .on('leave', function (username) {
            printStatusFrom(username + ' - ' + 'вышел из чата')
        })
        .on('join', function (username) {
            printStatusFrom(username + ' - ' + 'зашел в чат')
        })
        .on('connect', function () {
            printStatus('есть связь')
        })
        .on('disconnect', function () {
            printStatus('связь потеряна')
        })
        .on('logout', function () {
            location.href = '/'
        })
        .on('error', function (reason) {
            if (reason == 'handshake unauthorized') {
                printStatus('Вы вышли')
            } else {
                setTimeout(function () {
                    printStatus('Ошибка');
                    socket.socket.connect()
                }, 1000)
            }
        });


    function scrollTop(qvery) {
        $(qvery).scrollTop(999999)
    }

    function printStatusFrom(status) {
        $('#statusFrom').html(status)
    }

    function printStatus(status) {
        $('#status').html(status)
    }

    function printMessage(data) {

        $(messagesWrap).append(messageTmpl(data));
        scrollTop('#messages-wrap')

    }
}));

/*map*/


var map;
var position = {};
var initMap = co.wrap(function *() {
    var myLatLng = {lat: 46.482526, lng: 30.723309};
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 13
    });

    var markers = yield new Promise((resolve, reject)=> {
        $.ajax({
            url: '/map',
            method: 'POST',
            data: {},
            success: function (data) {

                resolve(data)
            },
            statusCode: {
                200: function () {

                },
                403: function (jqXHR) {
                    var error = JSON.parse(jqXHR.responseText);
                    alert(error);
                    reject(jqXHR);
                    // $('.error', form).html(error.message)
                }
            }
        });
    });
    markers.kpsObj = {};

    markers.kps.forEach(function (kp) {
        // console.log(kp);
        kp.ggl = new google.maps.Marker({
            position: {lat: kp.n, lng: kp.e},
            map: map,
            label: kp.kp + '',
            title: kp.kp + ' ' + kp.text
        });
        markers.kpsObj[kp.kp] = kp;
        // console.log( markers);

    });


    markers.messagesKp.forEach(function (message) {
        // console.log({lat: markers.kps[marker.kp].n, lng: markers.kps[marker.kp].e});
        message.ggl = new google.maps.Marker({
            position: {lat: markers.kpsObj[message.kp].n, lng: markers.kpsObj[message.kp].e},
            map: map,
            animation: google.maps.Animation.BOUNCE,
            label: message.team,
            title:  '' + message.text
        });

    });

    markers.messagesSos.forEach(function (message) {
        // console.log({lat: +message.n, lng: +message.e});

        message.sosGgl = new google.maps.Marker({
            position: {lat: +message.n, lng: +message.e},
            map: map,
            animation: google.maps.Animation.BOUNCE,
            label: message.team + ' SOS',
            title:'' + message.text

        });
    });

    socket.on('addMarker', function (kp, message) {
        // markers.kps.push(kp);
        console.log(arguments);
        kp ? position = {lat: kp.n, lng: kp.e} : position = {lat: message.n, lng: message.e};
        new google.maps.Marker({
            position: position,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            label: kp ? message.team + '' : 'SOS',
            title: message.team + ' ' + message.text
        });
    })


});
