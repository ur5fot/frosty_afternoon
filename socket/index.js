var log = require('../libs/log')(module),
    config = require('../config'),
    connect = require('connect'),
    co = require('co'),
    cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    HttpError = require('../error').HttpError,
    User = require('../models/user').User,
    Kp = require('../models/kp').Kp,
    sessionStore = require('../libs/sessionStore');

function LoadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length === 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    })
}

function LoadUser(session, callback) {
    if (!session.user) {
        return callback(null, null)
    }
    User.findById(session.user, function (err, user) {
        if (err) {
            return callback(err)
        }
        if (!user) {
            return callback(null, null)
        }
        // log.debug('user findById: ' + user);
        callback(null, user)
    })
}


module.exports = function (server) {

    var io = require('socket.io').listen(server);
    // var team;

    // io.set(config.get('socketIo'));
    
    io.use(function (socket, next) {
        co(function *() {

            handshake = socket.handshake;
            try {
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies[config.get('session:key')];
                var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
                // console.log(sid)
            } catch (e) {
                console.error(e);
                new HttpError(500, 'Вы не авторизованы socket.oi')
            }

            var session = yield new Promise((resolve, reject)=> {

                LoadSession(sid, function (err, session) {
                    if (err) {
                        reject(err)
                    } else if (!session) {
                        reject(new HttpError(401, 'Вы не вошли'))
                    }
                    handshake.session = session;
                    handshake.session.sid = sid;
                    // console.log('LoadSession', session);
                    resolve(session)

                });

            });

            var user = yield new Promise((resolve, reject)=> {
                LoadUser(session, function (err, user) {
                    if (!user) {
                        // console.log('анонимная сесия')
                    }
                    if (err) {
                        reject(err);
                    }
                    handshake.user = user;

                    resolve(user);

                })
            });

            yield new Promise(resolve => next(resolve()));

        })
            .catch(function (err) {
                console.error(err);
                return next(err)
            });
    });

    io.on('sessreload', function (sid) {
        io.sockets.clients(function (err, clients) {

            if (err) {
                throw err
            }
            clients.forEach(function (clientId) {

                var client = io.sockets.sockets[clientId];

                if (client.handshake.session) {

                    if (client.handshake.session.sid !== sid) {
                        return
                    }

                    LoadSession(sid, function (err, session) {
                        if (err) {
                            client.emit('error', 'ошибка сервера');
                            client.disconnect();
                            return
                        }
                        if (!session) {
                            // console.log('session', session);
                            client.emit('logout');
                            client.disconnect();
                            return
                        }
                        client.handshake.session = session
                    })
                }

            });
        });
    });


    var Chat = require('../models/chat').Chat,
        ChatError = require('../models/user').ChatError;

    io.on('connection', co.wrap(function *(socket) {
        function notRepeatedEmit(event, data) {
            io.sockets.clients(function (err, clients) {
                if (err) {
                    throw new HttpError(500)
                }

                clients.forEach(function (clientId) {
                    var client = io.sockets.sockets[clientId];

                    if (client.handshake.session) {
                        if (client.handshake.session.user === socket.handshake.session.user) {
                            return
                        }
                    }

                    client.emit(event, data)

                });
            });
        }
      

        if (socket.handshake.user) {

            var username = socket.handshake.user.team;

            notRepeatedEmit('join', username);

            socket.on('message', co.wrap(function *(message) {
                message.team = username;
                var chat = yield Chat.add(message).catch(function (err) {
                    console.error('Fa.add socket', err);
                    return new HttpError(403, err.message);
                });

                io.sockets.emit('message', chat);

                if (chat.kp > 0) {
                    var kp = yield Kp.findOneP({kp: chat.kp});
                    io.sockets.emit('addMarker', kp, chat)
                }
                console.log(chat);
                if (chat.n && chat.e) {
                    io.sockets.emit('addMarker', null, chat)
                }

            }));

            socket.on('disconnect', function () {
                notRepeatedEmit('leave', username);
            });
        }

    }));

    return io;
};














