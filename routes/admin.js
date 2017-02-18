var HttpError = require('../error').HttpError,
    Kp = require('../models/kp').Kp,
    KpError = require('../models/user').KpError,
    co = require('co');

exports.get = function (req, res, next) {
    res.render('admin', {title: 'Админ панель'});
};

exports.post = (function (req, res, next) {

    
    
    co(function *() {
        var kpObj = {
            kp: req.body.kp,
            n: req.body.n,
            e: req.body.e,
            text: req.body.text
        };

            yield  Kp.add(kpObj);

        // console.log('admin  Kp.add');
        res.send({})
    }).catch(function (err) {
        
        if (err instanceof KpError) {
            return next(new HttpError(403, err.message))
        } else {
            return next(err)
        }
    });
});

