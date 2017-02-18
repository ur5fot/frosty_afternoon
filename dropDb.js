var mongoose = require('./libs/mongoose'),
    async = require('async');
var User = require('./models/user').User;
var co = require('co');

mongoose.connection.on('open', function () {
    var db = mongoose.connection.db;
    // db.dropDatabase();
});


co(function *() {
  yield new Promise(resolve => mongoose.connection.on('open', resolve));
     // yield User.remove();
    var users = [
        {team: 'Вася', password: '1'},
        {team: 'Вася2', password: '2'},
        {team: 'Вася3', password: '3'}
    ];
    for (let i = 0; i < users.length; i++) {
        let user = new mongoose.models.User(users[i]);
        yield new Promise(resolve => user.save(resolve));
    }
    let user = yield User.authorized('Вася4', '4');
    // console.log('createDb', user);
    // yield User.remove();
    yield mongoose.connection.close();
}).catch(function (err) {
    console.error(err)
});

/*
async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    authorizedUsers
], function (err) {
    console.log(arguments);
    mongoose.disconnect();
});

function open(callback) {
    mongoose.connection.on('open', callback)
}

function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback) {
    require('./models/user');

    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback)
    }, callback)

}

function createUsers(callback) {
    var users = [
        {team: 'Вася', password: '1'},
        {team: 'Вася2', password: '2'},
        {team: 'Вася3', password: '3'}
    ];
    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback)
    }, callback)
}

function authorizedUsers(collback) {
    User.authorized('Вася', '1', function (err, user) {
        if (err) {
            console.error(err);

        }

        console.log('createDb', user);
        collback(null, user)
    });
}*/
