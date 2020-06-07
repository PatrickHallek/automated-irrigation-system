const irrigationService = require("../services/irrigation-service")
const sensorService = require("../services/sensor-service")
const preferenceService = require("../services/preference-service")

exports.irrigation = async (req, res, next) => {
    const preferences = await preferenceService.getPreferences(req.params.sensorName);
    const sensorResult = await sensorService.irrigate(preferences.irrigationTimeInSeconds, req.params.sensorName);
    if (sensorResult) {
        await irrigationService.setIrregation(null).then(() => {
            res.status(200);
            res.json("Success");
        });
    } else {
        res.status(500);
        res.json("Failed");
    }

};
