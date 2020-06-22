import mongoose from 'mongoose';

const secondlyMeasurementSchema = new mongoose.Schema({
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

export default mongoose.model('secondly_measurements', secondlyMeasurementSchema);
