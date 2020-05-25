// Load envs
const dotenv = require('dotenv');
dotenv.config();

if (process.env.DEVELOPMENT) {  const rpio = {} }
else { const rpio = require('rpio') }

exports.irrigate = async (irrigationTimeInSeconds) => {
    console.log("Start Irrigation...")
    rpio.write(process.env.RELAY_PIN, rpio.HIGH);
    rpio.sleep(irrigationTimeInSeconds);
    rpio.write(process.env.RELAY_PIN, rpio.LOW);
    return "Success"
}
