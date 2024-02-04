const Preference = require('../models/preferences');

exports.getPreference = async (sensorName) => {
    return (sensorName && sensorName !== "undefined") ? await Preference.findOneAndUpdate({
            sensorName
        }, {
            $setOnInsert: {
                minIrrigationIntervalInMinutes: 15,
                irrigationTimeInSeconds: 10,
                capacityBuffer: 50,
                outputSensor: "Local",
                signalPin: 18,
                Nickname: sensorName,
                Batterypower: 1,
                ReadingIntervalInMinutes: 5,
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
        Nickname: payload.Nickname,
        Batterypower: payload.Batterypower,
        ReadingIntervalInMinutes: payload.ReadingIntervalInMinutes,
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
