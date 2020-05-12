const Preference = require('../models/preferences');

exports.getPreferences = async () => {
    const preference = await Preference.findOneAndUpdate(
        {},
        {
            $setOnInsert: {
                wateringTimeBufferInMinutes: 15,
                capacityBuffer: 30,
                wateringTimeInSeconds: 1,
                capacityMeanBuffer: 20
            }
        },
        {
            returnOriginal: false,
            upsert: true,
        });
    return preference
}

exports.updatePreferences = async (body) => {
    const preference = await Preference.findOneAndUpdate(
        {},
        {
            $setOnInsert: body
        },
        {
            returnOriginal: false,
            upsert: true,
        });
    return preference
}