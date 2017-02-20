var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var HttpError = require('./error').HttpError;
var session = require('express-session');
var config = require('./config');
var sessionStore = require('./libs/sessionStore');
var app = express();

// view engine setup
var hbs = require('hbs');
hbs.registerPartials(path.join(__dirname, 'templates/partials'));
// hbs.localsAsTemplateData(app);
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'templates')));

var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

app.use(session({
    secret: config.get('session:secret'), // ABCDE242342342314123421.SHA256
    resave: false,
    saveUninitialized: true,
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: sessionStore
}));

app.use(require('./middleware/sendHttpError'));

app.use(require('./middleware/loadUser'));

require('./routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next( new HttpError(404, 'Нет такого файла или страницы'));
});

// error handler
app.use(function(err, req, res, next) {
    if (typeof err == 'number') {
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            errorhandler()(err, req, res, next);
        } else {

            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
    
});

module.exports = app;
