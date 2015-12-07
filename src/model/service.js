var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Service
 */
var Service = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    scopes: [String],
    serviceSecret: {
        type: String,
        required: true
    }
});

Service.virtual('serviceId')
 .get(function () {
 return this.id;
 });

module.exports = mongoose.model('Service', Service);
