const Preference = require('../models/preferences');

exports.getPreferences = async () => {
    const preference = await Preference.findOneAndUpdate({}, {
        $setOnInsert: {
            minIrrigationIntervalInMinutes: 15,
            irrigationTimeInSeconds: 2,
            capacityBuffer: 30,
            capacityMeanBuffer: 20
        }
    }, {
        returnOriginal: false,
        upsert: true,
    });
    return preference
}

exports.updatePreferences = async (body) => {
    const preference = await Preference.findOneAndUpdate({}, {
        $set: body
    }, {
        returnOriginal: false,
        upsert: true,
        new: true
    });
    return preference
}
