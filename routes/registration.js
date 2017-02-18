var HttpError = require('../error').HttpError,
    User = require('../models/user').User,
    AuthError = require('../models/user').AuthError,
    co = require('co');

var recaptcha = require('../libs/recaptcha2');



exports.get = function (req, res, next) {
    // res.render('login', {title: 'Вход на сайт'});
};

exports.post = (function (req, res, next) {
    co(function*() {
        var team = req.body.team,
            password = req.body.password,
            category = req.body.category;

       var valid = yield recaptcha.validateRequest(req);

        var teamDb = yield User.registration(team, password, category);

        req.session.user = teamDb._id;
        res.send({})

    }).catch(function (err) {
        
        if (err instanceof AuthError) {
            return next(new HttpError(403, err.message))
        } else if(err[0]){
            return next(new HttpError(403, 'Вы не прошли тест на человечность, нажмите я не робот '))
        }else {
            return next(err)
        }
    })


});
