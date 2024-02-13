const Irrigation = require('../models/irrigations')
const Output = require('../models/outputs')
const preferenceService = require("../services/preference-service")

const dotenv = require('dotenv');


dotenv.config();
let rpio = {};
if (!process.env.DEVELOPMENT) rpio = require('rpio');


const irrigatelocal = async (irrigationtime, sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName)
    console.log("Starting Local Irrigation...")
    rpio.open(preferences.signalPin, rpio.OUTPUT, rpio.LOW);
    rpio.write(preferences.signalPin, rpio.HIGH);
    rpio.sleep(irrigationtime);
    rpio.write(preferences.signalPin, rpio.LOW);
    rpio.close(preferences.signalPin);
    return "Success"
}

const irrigateremote = async (outputSensor, signalPin, irrigationTimeInSeconds) => {
    console.log("Irrigateremote Creating pending irrigation entry for sensor... ");
    console.log(outputSensor);
    console.log("Using port... ");
    console.log(signalPin);
    if(! Output.findOne({outputSensor: outputSensor, signalPin: signalPin}))
        { 
          Output.create({ outputSensor: outputSensor, signalPin: signalPin, irrigationtime: irrigationTimeInSeconds });
        } 
}

const irrigatesensor = async (sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName);
    console.log("irrigatesensor was tasked with irrigating sensor... ");
    console.log(sensorName);
    if(preferences.outputSensor == "Local"){
            console.log("Irrigation port seems to be local... ");
            irrigatelocal(preferences.irrigationTimeInSeconds, sensorName)
        } else {
            console.log("Irrigation port seems to be remote... ");
            await irrigateremote(preferences.outputSensor, preferences.signalPin, preferences.irrigationTimeInSeconds)
        }
}

const isLastIrrigationTimeBufferPassed = async (preferences, sensorName) => {
    const lastMeasurement = await Irrigation.findOne({ sensorName }).sort({ timestamp: -1 });
    console.log("Checking if minimum time buffer has passed before irrigating again... ");
    const now = new Date().getTime()
    if (lastMeasurement) {
        let lastMeasurementTime = lastMeasurement.timestamp
        lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
        return now > lastMeasurementTimePlusBuffer
    } else return true
}

exports.startIrrigation = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    console.log("startIrrigation will start irrigating sensor... ");
    console.log(sensorName);
    return await irrigatesensor(sensorName)
    Irrigation.create({ capacity: "0", sensorName: req.params.sensorName});
}

exports.getPendingIrrigations = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return Output.find( { outputSensor: sensorName } )
}

exports.getIrrigations = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    return Irrigation.find( { sensorName: sensorName } )
}

exports.clearPendingIrrigations = async (sensorName) => {
    //return await Irrigation.find({ sensorName })
    Output.deleteMany({ outputSensor: sensorName })
}

exports.irrigateIfNeeded = async (currentCapacity, sensorName) => {
    console.log("Will irrigate only if soil is dry sensor... ");
    console.log(sensorName);
    const preferences = await preferenceService.getPreference(sensorName)
    if (await isLastIrrigationTimeBufferPassed(preferences, sensorName) && currentCapacity < preferences.capacityBuffer) {
        await irrigatesensor(sensorName);
        Irrigation.create({ currentCapacity, sensorName });
    }
}




