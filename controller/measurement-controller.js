const measurementService = require("../services/measurement-service")

exports.getMeasurements = async (req, res, next) => {
    res.json(await measurementService.getMeasurements(req.params.filter));
};