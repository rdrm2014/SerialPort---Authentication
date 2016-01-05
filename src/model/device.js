var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Device
 */
var Device = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    scopes: [String],
    deviceSecret: {
        type: String,
        required: true
    }
});

Device.virtual('deviceId')
 .get(function () {
 return this.id;
 });

module.exports = mongoose.model('Device', Device);
