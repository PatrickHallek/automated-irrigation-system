const irrigationService = require("../services/irrigation-service")

exports.getIrrigations = async (req, res, next) => {
    res.json(await irrigationService.getIrrigations(req.params.sensorName));
};

exports.irrigate = async (req, res, next) => {
    await irrigationService.startIrrigation(req.params.sensorName);
    res.status(200);
    res.json("Success");
};
