const Preference = require('../models/preferences');

exports.getPreference = async (sensorName) => {
    return sensorName ? preference = await Preference.findOneAndUpdate({
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

exports.getPreferences = async () => {
    return await Preference.find({})
}

exports.updatePreferences = async (payload, sensorName) => {
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
