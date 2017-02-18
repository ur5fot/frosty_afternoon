var User = require('../models/user').User;
var config = require('../config');

module.exports = function(req, res, next) {
    req.user = res.locals.user = null;
    if (!req.session.user) return next();

    User.findById(req.session.user, function(err, user) {
        if (err) return next(err);

        req.user = res.locals.user = user;

        user.team === config.get('site:nameAdmin')
            ? req.user.isAdmin = res.locals.user.IsAdmin = true
            : req.user.isAdmin = res.locals.user.IsAdmin = false;
        next();
    });
};