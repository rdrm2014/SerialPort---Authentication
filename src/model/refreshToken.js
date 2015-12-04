var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * RefreshToken
 */
var RefreshToken = new Schema({
    userId: {
        type: String,
        required: true
    },
    serviceId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RefreshToken', RefreshToken);