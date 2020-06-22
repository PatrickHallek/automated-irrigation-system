import mongoose from 'mongoose';

const minutelyMeasurementSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 3600,
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

export default mongoose.model('minutely_measurements', minutelyMeasurementSchema);
