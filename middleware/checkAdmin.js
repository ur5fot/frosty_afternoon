const HttpError = require('../error').HttpError;

module.exports = function(req, res, next) {
    if (!req.user.isAdmin) {
        return next(new HttpError(401, "Вы неимеете доступа на эту страницу"));
    }

    next();
};