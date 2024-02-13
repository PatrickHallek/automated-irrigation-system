const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const outputSchema = new Schema({
   outputSensor: {
        type: String,
        require: true
   },
   signalPin: {
        type: Number,
        require: true
   },
  irrigationtime: {
     type: Number,
     require: true
  }
});
module.exports = mongoose.model('outputs', outputSchema);
