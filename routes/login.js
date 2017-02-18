var HttpError = require('../error').HttpError,
    User = require('../models/user').User,
    AuthError = require('../models/user').AuthError,
    co = require('co');

exports.get = function (req, res, next) {

    res.render('login', {title: 'Вход на сайт'});
};

exports.post = (function (req, res, next) {
    // console.log('req.url', req);
    console.log('admin  Kp.add', req.params.action);
    co(function*  () {
        var team = req.body.team,
            password = req.body.password;
        // console.log(team);

        var teamDb = yield User.authorized(team, password);
      
        req.session.user = teamDb._id;
        res.send({})
    }).catch(function (err) {
        console.error(err);
        if (err instanceof AuthError) {
            return next(new HttpError(403, err.message))
        } else {
            return next(err)
        }
    })


});

