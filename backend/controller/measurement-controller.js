const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")

exports.getLastMinuteMeasurements = async (req, res, next) => {
    res.json(await measurementService.getSecondlyMeasurements());
};

exports.getLastHourMeasurements = async (req, res, next) => {
    res.json(await measurementService.getMinutelyMeasurements());
};

exports.getLastDayMeasurements = async (req, res, next) => {
    res.json(await measurementService.getHourlyMeasurements());
};

exports.getLastWeekMeasurements = async (req, res, next) => {
    const queryFilter = {
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
    }
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.getLastMonthMeasurements = async (req, res, next) => {
    const queryFilter = {
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
    }
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.getAllMeasurements = async (req, res, next) => {
    const queryFilter = {}
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.setMeasurement = async (req, res, next) => {
    console.log(req.body.capacity)
    const result = await measurementService.setMeasurement(req.body.capacity);
    const irrigated = await irrigationService.irrigateIfNeeded(req.body.capacity);
    res.json({
        ...result,
        irrigated
    })
};
