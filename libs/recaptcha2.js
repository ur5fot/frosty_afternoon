var reCAPTCHA = require('recaptcha2');

module.exports  = new reCAPTCHA( {
    'siteKey': process.env.SITE_KEY,
    'secretKey': process.env.SECRET_KEY
} );
