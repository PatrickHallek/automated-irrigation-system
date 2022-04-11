const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const portSchema = new Schema({ port: Number, time: Number });
const outputSchema = new Schema({
   outputSensor: {
        type: String,
        require: true
   },
  Porttimes: {
    type: [portSchema],
    default: undefined
  }
});
module.exports = mongoose.model('outputs', outputSchema);
