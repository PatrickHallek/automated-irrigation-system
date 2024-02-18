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
    salt: {
        type: Number,
        require: false
    },
    battery: {
        type: Number,
        require: false
    },
    temperature: {
        type: Number,
        require: false
    },
    humidity: {
        type: Number,
        require: false
    },
    light: {
        type: Number,
        require: false
    },
    sensorName: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('secondly_measurements', secondlyMeasurementSchema);
