const preferenceService = require("../services/preference-service")

exports.getPreferences = async (req, res, next) => {
    res.json(await preferenceService.getPreferences(req.params.sensorName));
};

exports.updatePreferences = async (req, res, next) => {
    res.json(await preferenceService.updatePreferences(req.body, req.params.sensorName));
};
