

$(function () {
    var socket = io.connect();
    var sendPanelForm = $('#send-panel-form');
    var inputN = sendPanelForm.find('[name=n]');
    var inputE = sendPanelForm.find('[name=e]');
    var sos = sendPanelForm.find('[name=sos]');

    var messagesWrap = $('#messages-wrap');
    scrollTop('#messages-wrap');
    var messageTmpl = '';
    $.get('/partials/message.hbs', function (html) {
         messageTmpl = Handlebars.compile(html);
        sendPanelForm.submit(function (evn) {
            evn.preventDefault();
            // sendMessage();
            var form = $(this);


            var n = inputN.val();
            var e = inputE.val();

            var input = form.find('[name=message]');
            var inputKp = form.find('[name=kp]');
            var text = input.val();
            var kp = inputKp.val();

            var message = {};

            input.val('');
            inputKp.val('');
            inputN.val('');
            inputE.val('');

            if (kp) {
                message.kp = kp;
            }

            if (text) {
                message.text = text;
            }

            if (e && n) {
                message.n = n;
                message.e = e;
            }

            if (kp || text || e && n) {
                socket.emit('message', message);
            }

            return false
        });

        sos.click(function (e) {

            e.preventDefault();

           navigator.geolocation.getCurrentPosition(function (position) {
               inputN.val(position.coords.latitude);
               inputE.val(position.coords.longitude);
            });
        });




    });

    socket
        .on('message', function (messageObj) {
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
            // location.href = '/'
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

});

