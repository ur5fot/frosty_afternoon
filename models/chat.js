var log = require('../libs/log')(module);
var config = require('../config');

var mongoose = require('../libs/mongoose'),
    HttpError = require('../error').HttpError,
    Schema = mongoose.Schema,
    co = require('co'),
    util = require('util');

var schema = new Schema({
    team: {
        type: String,
        unique: false,
        required: true
    },
    text: {
        type: String,
        unique: false,
        required: false
    },
    kp: {
        type: String,
        unique: false,
        required: false
    },
    n: {
        type: String,
        unique: false,
        required: false
    },
    e: {
        type: String,
        unique: false,
        required: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.statics.add = co.wrap(function *(message) {

    var messagesLength = yield this.countP();
    var maxMessagesLength = config.get('chat:countMessage');

    // console.log('messagesLength',messagesLength);

    // log.info('create message', team);
    if (messagesLength > maxMessagesLength) {

        var messages = yield this.findP({});

        var oldMessages = messages.slice(maxMessagesLength - 2);

        for (let i = 0; i < oldMessages.length; i++) {
            yield  this.removeP({_id: oldMessages[i]._id});
        }

    }
    var chatNew = yield this.createP(message);
    yield chatNew.saveP();
    return chatNew
});

schema.statics.get = co.wrap(function *(param) {

    return yield this.findP(param);
});

exports.Chat = mongoose.model('Chat', schema);

function ChatError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, ChatError);

    this.message = message;
}

util.inherits(ChatError, Error);
ChatError.prototype.name = 'ChatError';

exports.ChatError = ChatError;