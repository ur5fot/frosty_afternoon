var crypto = require('crypto');
var log = require('../libs/log')(module);

var mongoose = require('../libs/mongoose'),
    HttpError = require('../error').HttpError,
    Schema = mongoose.Schema,
    co = require('co'),
    util = require('util');

var schema = new Schema({
    team: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });


schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorized = co.wrap(function *(team, password) {
    // yield this.remove();
    var user = yield this.findOneP({team: team});
    if (user) {

        if (user.checkPassword(password)) {
            return user
        } else {
            return Promise.reject(new AuthError('Пароль неверен'))
        }

    } else {
        return Promise.reject(new AuthError('Нет такой команды'))
    }

});

schema.statics.registration = co.wrap(function *(team, password, category) {
    var user = yield this.findOneP({team: team});
    console.log(arguments);
    if (user) {
        return Promise.reject(new AuthError('Команда уже есть такая'))

    } else {
        var userNew = yield  this.createP({team: team, password: password, category: category});
        yield userNew.saveP();
        log.info('create user', team);
        return userNew
    }

});

exports.User = mongoose.model('User', schema);

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message;
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;