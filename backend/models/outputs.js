const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outputSchema = new Schema({
   outputSensor: {
        type: String,
        require: true
   },
  Porttimes: {
    type: Map,
    of: new Schema({
      port: Number,
      time: Number
    })
  }
});
module.exports = mongoose.model('outputs', outputSchema);
