const dotenv = require('dotenv');
dotenv.config();
const preferenceService = require("../services/preference-service")
let rpio = {};
if (!process.env.DEVELOPMENT) rpio = require('rpio');

exports.irrigate = async (irrigationTimeInSeconds, sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName)
    console.log("Start Irrigation...")
    rpio.open(preferences.signalPin, rpio.OUTPUT, rpio.LOW);
    rpio.write(preferences.signalPin, rpio.HIGH);
    rpio.sleep(irrigationTimeInSeconds);
    rpio.write(preferences.signalPin, rpio.LOW);
    rpio.close(preferences.signalPin);
    return "Success"
}

exports.getSensorNames = async () => {
    const preferences = await preferenceService.getPreferences()
    return preferences.map(preference => preference.sensorName)
}
