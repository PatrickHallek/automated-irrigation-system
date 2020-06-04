const rpio = require('rpio');
const dotenv = require('dotenv');
dotenv.config();

exports.irrigate = async (irrigationTimeInSeconds) => {
    console.log("Start Irrigation...")
    rpio.open(process.env.RELAY_PIN, rpio.OUTPUT, rpio.LOW);
    rpio.write(process.env.RELAY_PIN, rpio.HIGH);
    rpio.sleep(irrigationTimeInSeconds);
    rpio.write(process.env.RELAY_PIN, rpio.LOW);
    rpio.close(process.env.RELAY_PIN);
    return "Success"
}
