const Irrigation = require('../models/irrigations')
const Output = require('../models/outputs')
const preferenceService = require("../services/preference-service")
const sensorService = require("../services/sensor-service")
const irrigationService = require("./irrigation-service")

exports.getLastIrrigation = async (sensorName) => {
    return await Irrigation.findOne({ sensorName }).sort({ timestamp: -1 });
}

exports.setIrregation = async (capacity, sensorName) => {
    return await Irrigation.create({ capacity, sensorName })
}

exports.getIrrigations = async (sensorName) => {
    return await Irrigation.find({ sensorName })
}

exports.getOutputs = async (sensorName) => {
    return await Output.find({ sensorName })
}

exports.getOneOutput = async (sensorName) => {
    return await Output.findOne({ sensorName });
}

exports.updateOutputs = async (outputSensor, signalPin, irrigationTimeInSeconds) => {
    if(!Output.findOne({outputSensor: outputSensor, signalPin: signalPin})) 
        { 
            console.log("h")
          Output.insert({outputSensor: outputSensor, signalPin: signalPin, irrigationtime: irrigationTimeInSeconds}) 
        } else{
           console.log("i")
           Output.findOneAndUpdate(
                {
                    outputSensor: outputSensor,
                    signalPin: signalPin
                },
                { $set: {irrigationtime: irrigationTimeInSeconds} },
                {
                    returnOriginal: false,
                    upsert: true,
                    new: true
                }
            );
        }
    const outputs = await Output.findOne({outputSensor: outputSensor, signalPin: signalPin})
    console.log(outputs)
    console.log(outputSensor)
    console.log(signalPin)
    return outputs
}

exports.irrigateIfNeeded = async (currentCapacity, sensorName) => {
    const preferences = await preferenceService.getPreference(sensorName)
    console.log("a")
    console.log(sensorName)
    if (await isLastIrrigationTimeBufferPassed(preferences, sensorName) && currentCapacity > preferences.capacityBuffer) {
        irrigationService.setIrregation(currentCapacity, sensorName)
        console.log("b")
        if(preferences.outputSensor == "Local"){
            sensorService.irrigate(preferences.irrigationTimeInSeconds, sensorName)
            console.log("c")
        } else {
            await irrigationService.updateOutputs(preferences.outputSensor, preferences.signalPin, preferences.irrigationTimeInSeconds)
            console.log("d")
        }
    }
    console.log("e")
    const irrigateports = await irrigationService.getOutputs(sensorName)
    const irrigateport = await irrigationService.getOneOutput(sensorName)
    console.log("f")
    console.log(irrigateports)
    console.log(irrigateport)
    await Output.deleteMany({ outputSensor: sensorName })
    console.log("g")
    console.log(irrigateports)
    return irrigateports
}

async function isLastIrrigationTimeBufferPassed(preferences, sensorName) {
    const lastMeasurement = await irrigationService.getLastIrrigation(sensorName)
    const now = new Date().getTime()
    if (lastMeasurement) {
        let lastMeasurementTime = lastMeasurement.timestamp
        lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
        return now > lastMeasurementTimePlusBuffer
    } else return true
}
