import mongoose from 'mongoose';

const dailyMeasurementSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
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

export default mongoose.model('daily_measurements', dailyMeasurementSchema);
