var HttpError = require('../error').HttpError,
    Kp = require('../models/kp').Kp,
    Chat = require('../models/chat').Chat,
    KpError = require('../models/user').KpError,
    co = require('co');

/* GET home page. */
exports.get = function (req, res, next) {
    res.render('map', {title: 'Карта'});
};


exports.post = function (req, res, next) {
    co(function *() {
        var kps = yield Kp.get(req.body);
        var messagesKp = yield Chat.findP({kp:{$gt: 0}});
        var messagesSos = yield Chat.findP({n:{$gt: 0} , e:{$gt: 0}});
        res.send({kps: kps, messagesKp: messagesKp, messagesSos: messagesSos})
    }).catch(function (err) {
        next(new HttpError(500, err.message))
    })
};




