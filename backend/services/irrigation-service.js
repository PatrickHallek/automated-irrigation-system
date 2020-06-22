import Irrigation from '../models/irrigations'
import { PreferenceService } from "../services/preference-service"
import { irrigate } from "../services/sensor-service"

export class IrrigationSerivce {

    async getLastIrrigation(sensorName) {
        return await Irrigation.findOne({
            sensorName
        }).sort({
            timestamp: -1
        });
    }

    async setIrregation(capacity, sensorName) {
        return await Irrigation.create({
            capacity,
            sensorName
        })
    }

    async getIrrigations(sensorName) {
        return await Irrigation.find({
            sensorName
        })
    }

    async irrigateIfNeeded(currentCapacity, sensorName) {
        const preferences = await PreferenceService.getPreference(sensorName)
        if (await this.isLastIrrigationTimeBufferPassed(preferences, sensorName) && currentCapacity > preferences.capacityBuffer) {
            this.setIrregation(currentCapacity, sensorName)
            irrigate(preferences.irrigationTimeInSeconds, sensorName)
            return true
        } else return false
    }

    async isLastIrrigationTimeBufferPassed(preferences, sensorName) {
        const lastMeasurement = await this.getLastIrrigation(sensorName)
        const now = new Date().getTime()
        if (lastMeasurement) {
            let lastMeasurementTime = lastMeasurement.timestamp
            lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
            return now > lastMeasurementTimePlusBuffer
        } else return true
    }

}
