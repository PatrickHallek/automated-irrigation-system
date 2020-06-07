const Irrigation = require('../models/irrigations')
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

exports.irrigateIfNeeded = async (currentCapacity, sensorName) => {
    const preferences = await preferenceService.getPreferences(sensorName)
    if (await isLastIrrigationTimeBufferPassed(preferences, sensorName) && currentCapacity > preferences.capacityBuffer) {
        irrigationService.setIrregation(currentCapacity, sensorName)
        sensorService.irrigate(preferences.irrigationTimeInSeconds, sensorName)
        return true
    } else return false
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
