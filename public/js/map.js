var socket = io.connect();
var map;
var position = {};

var initMap = co.wrap(function *() {
    var myLatLng = {lat: 46.482526, lng: 30.723309};
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 13
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

});
