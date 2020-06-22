import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
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
    }
})

export default mongoose.model('preferences', preferenceSchema);
