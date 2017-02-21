var mongoose = require('mongoose-aplus'),
    config = require('../config');
// process.env.PORT
mongoose.connect( process.env.MONGODB_URI || config.get('mongoose:uri'), config.get('mongoose:options'));

module.exports = mongoose;