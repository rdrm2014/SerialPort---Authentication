var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * AccessToken
 */
var AccessToken = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    scopes: [String],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AccessToken', AccessToken);