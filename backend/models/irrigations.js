import mongoose from 'mongoose';

const irrigationSchema = new mongoose.Schema({
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

export default mongoose.model('irrigations', irrigationSchema);
