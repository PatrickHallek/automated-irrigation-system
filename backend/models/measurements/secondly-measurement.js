const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const secondlyMeasurementSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 60,
        require: true
    },
    capacity: {
        type: Number,
        require: true
    },
    sensorName: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('secondly_measurements', secondlyMeasurementSchema);
