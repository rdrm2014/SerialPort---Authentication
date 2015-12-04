var express = require('express');
var passport = require('passport');
var router = express.Router();

var src = process.cwd() + '/src/';
var log = require(src + 'log/log')(module);
var Service = require(src + 'model/service');
var AccessToken = require(src + 'model/accessToken');
var config = require(src + 'config/config');

/**
 * GET /api/services
 */
router.get('/', isLoggedIn, function (req, res) {
    Service.find(function (err, services) {
        if (!err) {
            AccessToken.find({"userId": req.user.userId}, function (err, accessTokens) {
                return res.render('api/services/index', {
                    title: config.get('title'),
                    user: req.user,
                    services: services,
                    accessTokens: accessTokens
                });
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                error: 'Server error'
            });
        }
    });
});

/**
 * GET /api/services/addservice
 */
router.get('/addservice', isLoggedIn, function (req, res) {
        res.render('api/services/addService', {title: config.get('title'), user: req.user});
    }
);

/**
 * POST /api/services/addservice
 */
router.post('/addservice', isLoggedIn, function (req, res) {
        var name = req.body['name'];
        var serviceSecret = req.body['serviceSecret'];
        var scopes = req.body['scopes'];

        var service = new Service({
            name: name,
            serviceSecret: serviceSecret,
            scopes: scopes
        });
        service.save(function (err, service) {
            if (err) {
                return log.error(err);
            }
            res.redirect('/api/services/');
        });
    }
);

module.exports = router;

/**
 * Route middleware to ensure user is logged in
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}