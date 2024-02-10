const Irrigation = require('../models/irrigations')
const Output = require('../models/outputs')
const preferenceService = require("../services/preference-service")

const dotenv = require('dotenv');


dotenv.config();
let rpio = {};
if (!process.env.DEVELOPMENT) rpio = require('rpio');


const irrigatelocal = async (irrigationtime, sensorName) => {
    const preferences = preferenceService.getPreference(sensorName)
    console.log("Starting Irrigation...")
    rpio.open(preferences.signalPin, rpio.OUTPUT, rpio.LOW);
    rpio.write(preferences.signalPin, rpio.HIGH);
    rpio.sleep(irrigationtime);
    rpio.write(preferences.signalPin, rpio.LOW);
    rpio.close(preferences.signalPin);
    return "Success"
}

const irrigateremote = (outputSensor, signalPin, irrigationTimeInSeconds) => {
    if(! Output.findOne({outputSensor: outputSensor, signalPin: signalPin}))
        { 
          Output.create({ outputSensor: outputSensor, signalPin: signalPin, irrigationtime: irrigationTimeInSeconds });
        } 
}

const irrigatesensor = (sensorName) => {
    const preferences = preferenceService.getPreference(sensorName);
    if(preferences.outputSensor == "Local"){
            irrigatelocal(preferences.irrigationTimeInSeconds, sensorName)
        } else {
            irrigateremote(preferences.outputSensor, preferences.signalPin, preferences.irrigationTimeInSeconds)
        }
}

const isLastIrrigationTimeBufferPassed = (preferences, sensorName) => {
    const lastMeasurement = Irrigation.findOne({ sensorName }).sort({ timestamp: -1 });
    const now = new Date().getTime()
    if (lastMeasurement) {
        let lastMeasurementTime = lastMeasurement.timestamp
        lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
        return now > lastMeasurementTimePlusBuffer
    } else return true
}

exports.startIrrigation = (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return irrigatesensor(sensorName)
    Irrigation.create({ capacity: "0", sensorName: req.params.sensorName});
}

exports.getPendingIrrigations = (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return Output.find( { outputSensor: sensorName } )
}

exports.getIrrigations = (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return Irrigation.find( { sensorName: sensorName } )
}

exports.clearPendingIrrigations = (sensorName) => {
    //return await Irrigation.find({ sensorName })
    Output.deleteMany({ outputSensor: sensorName })
}

exports.irrigateIfNeeded = (currentCapacity, sensorName) => {
    const preferences = preferenceService.getPreference(sensorName)
    if (isLastIrrigationTimeBufferPassed(preferences, sensorName) && currentCapacity < preferences.capacityBuffer) {
        irrigatesensor(sensorName);
        Irrigation.create({ currentCapacity, sensorName });
    }
}


