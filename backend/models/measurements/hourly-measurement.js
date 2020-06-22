import mongoose from 'mongoose';

const hourlyMeasurementSchema = new mongoose.Schema({
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

export default mongoose.model('hourly_measurements', hourlyMeasurementSchema);
