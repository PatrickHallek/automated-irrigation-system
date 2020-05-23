const preferenceService = require("../services/preference-service")

exports.getPreferences = async (req, res, next) => {
    res.json(await preferenceService.getPreferences());
};

exports.updatePreferences = async (req, res, next) => {
    res.json(await preferenceService.updatePreferences(req.body));
};