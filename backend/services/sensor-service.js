const dotenv = require('dotenv');
dotenv.config();
const preferenceService = require("../services/preference-service")
const rpio = require('rpio');

exports.irrigate = async (irrigationTimeInSeconds, sensorName) => {
    const preferences = await preferenceService.getPreferences(sensorName)
    console.log("Start Irrigation...")
    rpio.open(preferences.signalPin, rpio.OUTPUT, rpio.LOW);
    rpio.write(preferences.signalPin, rpio.HIGH);
    rpio.sleep(irrigationTimeInSeconds);
    rpio.write(preferences.signalPin, rpio.LOW);
    rpio.close(preferences.signalPin);
    return "Success"
}
