var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    minIrrigationIntervalInMinutes: { type: Number },
    irrigationTimeInSeconds: { type: Number },
    capacityBuffer: { type: Number }
})

module.exports = mongoose.model('preferences', preferenceSchema);
