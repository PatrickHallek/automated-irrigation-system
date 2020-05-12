var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    wateringTimeBufferInMinutes: { type: Number },
    capacityBuffer: { type: Number },
    wateringTimeInSeconds: { type: Number },
    capacityMeanBuffer: { type: Number }
})

module.exports = mongoose.model('preferences', preferenceSchema);
