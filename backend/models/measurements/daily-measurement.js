const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyMeasurementSchema = new Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        require: true
    },
    capacity: {
        type: Number,
        require: true
    }
})
module.exports = mongoose.model('daily_measurements', dailyMeasurementSchema);
