const cron = require("node-cron");
const preferenceService = require("../services/preference-service")
const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")
const sensorService = require("../services/sensor-service")

exports.irrigationMonitor = () => {
    cron.schedule("*/10 * * * * *", async () => {
        const preferences = await preferenceService.getPreferences();
        const currentCapacity = await sensorService.getCurrentCapacity()
        console.log(`Waterlevel: ${currentCapacity}`);

        measurementService.setMeasurement(currentCapacity)

        const now = new Date().getTime()
        let lastMeasurementTime = (await irrigationService.getLastIrrigation()).timestamp
        lastMeasurementTime = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + 1)

        if (now < lastMeasurementTime) {
            console.log("The last irrigation has just been...")
            return
        }
        if (await measurementService.getCapacityMeanValue(preferences.capacityMeanBuffer) < preferences.capacityBuffer) {
            console.log("Irrigation")
            irrigationService.setIrregation(currentCapacity)
            sensorService.waterPlants(preferences.wateringTimeInSeconds)
            return
        }
    });
}
