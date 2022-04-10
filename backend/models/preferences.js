const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceSchema = new Schema({
    minIrrigationIntervalInMinutes: {
        type: Number,
        require: true
    },
    irrigationTimeInSeconds: {
        type: Number,
        require: true
    },
    capacityBuffer: {
        type: Number,
        require: true
    },
    sensorName: {
        type: String,
        require: true
    },
    
    signalPin: {
        type: Number,
        required: true
    },
    outputSensor: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('preferences', preferenceSchema);
