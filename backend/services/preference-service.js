import Preference from '../models/preferences';

export class PreferenceService {

    async getPreference(sensorName) {
        return (sensorName && sensorName !== "undefined") ? await Preference.findOneAndUpdate({
            sensorName
        }, {
            $setOnInsert: {
                minIrrigationIntervalInMinutes: 15,
                irrigationTimeInSeconds: 10,
                capacityBuffer: 500,
                signalPin: 18,
                sensorName
            }
        }, {
            returnOriginal: false,
            upsert: true,
            new: true
        }) : {}
    }

    async getPreferences() {
        return await Preference.find({})
    }

    async updatePreferences(payload, sensorName) {
        console.log(payload)
        const preferences = {
            minIrrigationIntervalInMinutes: payload.minIrrigationIntervalInMinutes,
            irrigationTimeInSeconds: payload.irrigationTimeInSeconds,
            capacityBuffer: payload.capacityBuffer,
            signalPin: payload.signalPin,
            sensorName: payload.sensorName
        }
        const preference = await Preference.findOneAndUpdate({
            sensorName
        }, {
            $set: preferences
        }, {
            returnOriginal: false,
            upsert: true,
            new: true
        });
        return preference
    }
}
