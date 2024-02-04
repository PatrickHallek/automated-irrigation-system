const Preference = require('../models/preferences');

exports.getPreference = async (sensorName) => {
    return (sensorName && sensorName !== "undefined") ? await Preference.findOneAndUpdate({
            sensorName
        }, {
            $setOnInsert: {
                minIrrigationIntervalInMinutes: 15,
                irrigationTimeInSeconds: 10,
                capacityBuffer: 500,
                outputSensor: "Local",
                signalPin: 18,
                Nickname: sensorName,
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
        outputSensor: payload.outputSensor,
        signalPin: payload.signalPin,
        Nickname: payload.sensorName,
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
