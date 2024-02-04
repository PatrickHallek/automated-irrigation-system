const Irrigation = require('../models/irrigations')
const Output = require('../models/outputs')
const preferenceService = require("../services/preference-service")

const dotenv = require('dotenv');


dotenv.config();
let rpio = {};
if (!process.env.DEVELOPMENT) rpio = require('rpio');


const irrigatelocal = async (irrigationtime, sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName)
    console.log("Starting Irrigation...")
    rpio.open(preferences.signalPin, rpio.OUTPUT, rpio.LOW);
    rpio.write(preferences.signalPin, rpio.HIGH);
    rpio.sleep(irrigationtime);
    rpio.write(preferences.signalPin, rpio.LOW);
    rpio.close(preferences.signalPin);
    return "Success"
}

const irrigateremote = async (outputSensor, signalPin, irrigationTimeInSeconds) => {
    if(! await Output.findOne({outputSensor: outputSensor, signalPin: signalPin}))
        { 
          await Output.create({ outputSensor: outputSensor, signalPin: signalPin, irrigationtime: irrigationTimeInSeconds });
        } 
}

const irrigatesensor = async (sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName);
    if(preferences.outputSensor == "Local"){
            irrigatelocal(preferences.irrigationTimeInSeconds, sensorName)
        } else {
            await irrigateremote(preferences.outputSensor, preferences.signalPin, preferences.irrigationTimeInSeconds)
        }
}

const isLastIrrigationTimeBufferPassed(preferences, sensorName) => {
    await Irrigation.findOne({ sensorName }).sort({ timestamp: -1 });
    const now = new Date().getTime()
    if (lastMeasurement) {
        let lastMeasurementTime = lastMeasurement.timestamp
        lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
        return now > lastMeasurementTimePlusBuffer
    } else return true
}

exports.startIrrigation = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return await irrigatesensor(sensorName)
}

exports.getPendingIrrigations = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return await Output.find( { outputSensor: sensorName } )
}

exports.getIrrigations = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return await Irrigation.find( { sensorName: sensorName } )
}

exports.clearPendingIrrigations = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    await Output.deleteMany({ outputSensor: sensorName })
}

exports.irrigation = async (req, res, next) => {
    await irrigatesensor(req.params.sensorName);
    await Irrigation.create({ 0, req.params.sensorName})
};

exports.irrigateIfNeeded = async (currentCapacity, sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName)
    if (await isLastIrrigationTimeBufferPassed(preferences, sensorName) && currentCapacity < preferences.capacityBuffer) {
        await irrigatesensor(sensorName);
        await Irrigation.create({ capacity, sensorName });
    }
}


