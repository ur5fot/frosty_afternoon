var nconf = require('nconf'),
    paht = require('path');

nconf.argv()
    .env()
    .file({ file: paht.join(__dirname, 'config.json')});

module.exports = nconf;