var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const irrigationSchema = new Schema({
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

module.exports = mongoose.model('irrigations', irrigationSchema);
