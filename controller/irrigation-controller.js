const irrigationService = require("../services/irrigation-service")

exports.getIrrigations = async (req, res, next) => {
    res.json(await irrigationService.getIrrigations(req.params.filter));
};