const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")

exports.getMeasurements = async (req, res, next) => {
    res.json(await measurementService.getMeasurements(req.params.filter));
};

exports.setMeasurement = async (req, res, next) => {
    console.log(req.body.capacity)
    const result = await measurementService.setMeasurement(req.body.capacity);
    const irrigated = await irrigationService.irrigateIfNeeded(req.body.capacity);
    res.json({
        ...result,
        irrigated: true
    })
};
