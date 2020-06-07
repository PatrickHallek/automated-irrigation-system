const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hourlyMeasurementSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 604800,
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

module.exports = mongoose.model('hourly_measurements', hourlyMeasurementSchema);
