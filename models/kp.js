var log = require('../libs/log')(module);
var _ = require('lodash');
var config = require('../config');

var mongoose = require('../libs/mongoose'),
    HttpError = require('../error').HttpError,
    Schema = mongoose.Schema,
    co = require('co'),
    util = require('util');

var schema = new Schema({

    kp: {
        type: Number,
        unique: true,
        required: true
    },
    n: {
        type: Number,
        unique: false,
        required: true
    },

    e: {
        type: Number,
        unique: false,
        required: true
    },
    text: {
        type: String,
        unique: false,
        required: false
    }

});

schema.statics.add = (co.wrap(function *(data) {
    // yield  this.remove();
    var itemNew = new this(data);

    return yield  itemNew.saveP();

}));

schema.statics.get = co.wrap(function *(data) {

    return yield this.findP(data);

});

exports.Kp = mongoose.model('Kp', schema);

function KpError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, KpError);

    this.message = message;
}

util.inherits(KpError, Error);
KpError.prototype.name = 'KpError';

exports.KpError = KpError;