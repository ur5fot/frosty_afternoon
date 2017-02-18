var reCAPTCHA = require('recaptcha2');
var config = require('../config');

module.exports  = new reCAPTCHA(config.get('site:reCAPTCHA'));