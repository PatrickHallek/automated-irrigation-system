const preferenceService = require("../services/preference-service")

exports.getPreference = async (req, res, next) => {
    res.json(await preferenceService.getPreference(req.params.sensorName));
};

exports.updatePreferences = async (req, res, next) => {
    res.json(await preferenceService.updatePreferences(req.body, req.params.sensorName));
};
