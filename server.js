/**
 * Created by ricardomendes on 21/09/15.
 */
var src = process.cwd() + '/src/';
var config = require(src + 'config/config');
var debug = require('debug')('restapi');

var log = require(src + 'log/log')(module);
var port = process.env.PORT || config.get('port') || 3000;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var mongoose = require('mongoose');
var passport = require('passport');

var app = express();

/**
 * Database Configuration
 */
mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;
db.on('error', function (err) {
    log.error('Connection error MongoDB:', err.message);
});
db.once('open', function callback() {
    log.info("Connected to DB!");
});

/**
 * App Configuration
 */
app.set('views', src + 'views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(session({resave: true, saveUninitialized: true, secret: 'secretpasswordforproject_ieeta'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(src + 'public'));

/**
 * Routes
 */
require(src + 'app')(app, passport);

/**
 * Catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * Development error handler
 * will print stacktrace
 */
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
/**
 * Production error handler
 * no stacktraces leaked to user
 */
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(port, function () {
    debug('Express server listening on port ' + port);
    log.info('Express server listening on port ' + port);
});

module.exports = app;