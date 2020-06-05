const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hourlyMeasurementSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 86400,
        require: true
    },
    capacity: {
        type: Number,
        require: true
    },
})

module.exports = mongoose.model('hourly_measurements', hourlyMeasurementSchema);
