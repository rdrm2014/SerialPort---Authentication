var express = require('express');
var passport = require('passport');
var router = express.Router();
var crypto = require('crypto');

var src = process.cwd() + '/src/';
var log = require(src + 'log/log')(module);
var User = require(src + 'model/user');
var Device = require(src + 'model/device');
var AccessToken = require(src + 'model/accessToken');
var RefreshToken = require(src + 'model/refreshToken');

var config = require(src + 'config/config');

/**
 * GET /api/tokens
 */
router.get('/', isLoggedIn, function (req, res) {
    AccessToken.find({"userId": req.user.userId}, function (err, accessTokens) {
        if (!err) {
            return res.render('api/tokens/index', {
                title: config.get('title'),
                user: req.user,
                accessTokens: accessTokens
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.json({
                error: 'Server error'
            });
        }
    })
        .populate('userId')
        .populate('deviceId');
});

/**
 * GET /api/tokens/addtoken
 */
router.get('/addtoken', isLoggedIn, function (req, res) {
        Device.find(function (err, devices) {
            if (!err) {
                console.log("userId: " + req.user.userId);
                AccessToken.find({"userId": req.user.userId}, function (err, accessTokens) {
                    return res.render('api/tokens/addToken', {
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
    }
);

/**
 * POST /api/tokens/addtoken
 */
router.post('/addtoken', isLoggedIn, function (req, res) {
        console.log(req.body);
        var deviceId = req.body['deviceId'];
        var scopes = req.body['scope'];

        console.log(req.user);
        User.findOne({'_id': req.user.userId}, function (err, user) {
            if (err) {
                return done(err);
            }
            Device.findOne({'_id': deviceId}, function (err, device) {
                if (err) {
                    return done(err);
                }
                var model = {
                    userId: user.userId,
                    deviceId: device._id,
                    scopes: scopes
                };
                generateTokens(model);
                res.redirect('/api/tokens/');
            });
        });
    }
);

module.exports = router;

/**
 * Destroys any old tokens and generates a new access and refresh token
 * @param data
 */
function generateTokens(data) {
    var refreshToken,
        refreshTokenValue,
        token,
        tokenValue;

    RefreshToken.remove(data);
    AccessToken.remove(data);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new AccessToken(data);

    data.token = refreshTokenValue;
    refreshToken = new RefreshToken(data);

    refreshToken.save();

    token.save(function (err) {
        if (err) {
            log.error(err);
            return log.error(err);
        }
    });
}

/**
 * route middleware to ensure user is logged in
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