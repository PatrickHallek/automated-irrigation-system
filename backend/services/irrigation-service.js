const Irrigation = require('../models/irrigations');
const preferenceService = require("../services/preference-service")
const sensorService = require("../services/sensor-service")
const irrigationService = require("./irrigation-service")

exports.getLastIrrigation = async () => {
    return await Irrigation.findOne().sort({ timestamp: -1 });
}

exports.setIrregation = async (currentCapacity) => {
    return await Irrigation.create({ capacity: currentCapacity })
}

exports.getIrrigations = async (filter) => {
    return await Irrigation.find({})
}

exports.irrigateIfNeeded = async (currentCapacity) => {
    const preferences = await preferenceService.getPreferences()
    if (await isLastIrrigationTimeBufferPassed(preferences) && currentCapacity > preferences.capacityBuffer) {
        irrigationService.setIrregation(currentCapacity)
        sensorService.irrigate(preferences.irrigationTimeInSeconds)
        return true
    } else return false
}

async function isLastIrrigationTimeBufferPassed(preferences) {
    const lastMeasurement = await irrigationService.getLastIrrigation()
    const now = new Date().getTime()
    if (lastMeasurement) {
        let lastMeasurementTime = lastMeasurement.timestamp
        lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
        return now > lastMeasurementTimePlusBuffer
    } else return true
}
