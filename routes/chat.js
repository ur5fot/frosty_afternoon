var Chat = require('../models/chat').Chat;
var co = require('co');

exports.get = co.wrap(function *(req, res, next) {
    var messages = yield Chat.get().catch(function (e) {
        console.error(e)
    });
     messages.forEach(function (message) {
        if (req.user) {
            if (message.team === req.user.team) {
                message.isIm = true
            } else {

                message.isIm = false
            }
        } else {
            message.isIm = false
        }

    });
    // console.log('messages', messages);
    res.render('chat', {title: 'Chat', messages: messages});

});

