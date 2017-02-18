// var checkAuth = require('../middleware/checkAuth');
var checkAdmin = require('../middleware/checkAdmin');

module.exports = function (app) {

    app.route('/').get(require('./home').get);

    app.route('/login')
        .get(require('./login').get)
        .post(require('./login').post);

    app.route('/registration')
        .post(require('./registration').post);

    app.route('/admin')
        .get(checkAdmin, require('./admin').get)
        .post(checkAdmin, require('./admin').post);

    app.route('/admin/delkp')
        // .get(checkAdmin, require('./admin').get)
        .post(checkAdmin, require('./admindelkp').post);


    app.route('/logout')
        .post(require('./logout').post);

    // app.get('/chat', checkAuth, require('./chat').get);

    app.route('/chat')
        .get(require('./chat').get);

    app.route('/map')
        .get(require('./map').get)
        .post(require('./map').post);


};