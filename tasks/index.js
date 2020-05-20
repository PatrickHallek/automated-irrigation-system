const cron = require("node-cron");
const preferenceService = require("../services/preference-service")
const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")
const sensorService = require("../services/sensor-service")

exports.irrigationMonitor = () => {
    cron.schedule("*/10 * * * * *", async () => {
        const preferences = await preferenceService.getPreferences();
        const currentCapacity = await sensorService.getCurrentCapacity()
        measurementService.setMeasurement(currentCapacity)

        const now = new Date().getTime()
        const lastMeasurement = await irrigationService.getLastIrrigation()
        if (lastMeasurement) {
            let lastMeasurementTime = lastMeasurement.timestamp
            lastMeasurementTime = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
            if (now < lastMeasurementTime) {
                return
            }
        }
        else if (await measurementService.getCapacityMeanValue(preferences.capacityMeanBuffer) < preferences.capacityBuffer) {
            console.log("Irrigation")
            irrigationService.setIrregation(currentCapacity)
            sensorService.waterPlants(preferences.irrigationTimeInSeconds)
            return
        }
    });
}
