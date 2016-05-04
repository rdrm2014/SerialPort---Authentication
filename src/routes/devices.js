var express = require('express');
var passport = require('passport');
var router = express.Router();

var src = process.cwd() + '/src/';
var log = require(src + 'log/log')(module);
var Device = require(src + 'model/device');
var AccessToken = require(src + 'model/accessToken');
var config = require(src + 'config/config');

/**
 * GET /api/devices
 */
router.get('/', isLoggedIn, function (req, res) {
    Device.find(function (err, devices) {
        if (!err) {
            AccessToken.find({"userId": req.user.userId}, function (err, accessTokens) {
                return res.render('api/devices/index', {
                    title: config.get('title'),
                    user: req.user,
                    devices: devices,
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
 * GET /api/devices/adddevice
 */
router.get('/adddevice', isLoggedIn, function (req, res) {
        res.render('api/devices/addDevice', {title: config.get('title'), user: req.user});
    }
);

/**
 * POST /api/devices/adddevice
 */
router.post('/adddevice', isLoggedIn, function (req, res) {
        var name = req.body['name'];
        var deviceSecret = req.body['deviceSecret'];
        var scopes = req.body['scopes'];

        var device = new Device({
            userId: req.user.userId,
            name: name,
            deviceSecret: deviceSecret,
            scopes: scopes
        });
        device.save(function (err, device) {
            if (err) {
                return log.error(err);
            }
            res.redirect('/api/devices/');
        });
    }
);

/**
 * Authorization
 * */

/**
 * GET /api/devices/info
 */
router.post('/info', passport.authenticate('bearer', {session: false}),
    function (req, res) {
        var name;
        if (req.user.local.username)
            name = req.user.local.username;
        else if (req.user.facebook.name)
            name = req.user.facebook.name;
        else if (req.user.twitter.displayName)
            name = req.user.twitter.displayName;
        else if (req.user.google.email || req.user.google.name) {
            name = req.user.google.email;
            name = req.user.google.name;
        }

        res.json({
            user_id: req.user.userId,
            name: name,
            channels: req.authInfo.scopes
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