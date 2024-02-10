const measurementService = require("../services/measurement-service")
const preferenceService = require("../services/preference-service")
const irrigationService = require("../services/irrigation-service")
const preferenceController = require("../controller/preference-controller")

exports.getLastMinuteMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setMinutes(new Date().getMinutes() - 1))
        }
    }
    res.json(await measurementService.getSecondlyMeasurements(queryFilter));
};

exports.getLastHourMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setHours(new Date().getHours() - 1))
        }
    }
    res.json(await measurementService.getMinutelyMeasurements(queryFilter));
};

exports.getLastDayMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 1))
        }
    }
    res.json(await measurementService.getHourlyMeasurements(queryFilter));
};

exports.getLastWeekMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
    }
    res.json(await measurementService.getHourlyMeasurements(queryFilter));
};

exports.getLastMonthMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName,
        timestamp: {
            $lte: new Date(),
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
    }
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.getAllMeasurements = async (req, res, next) => {
    const queryFilter = {
        sensorName: req.params.sensorName
    }
    res.json(await measurementService.getDailyMeasurements(queryFilter));
};

exports.setMeasurement = async (req, res, next) => {
    const measurementdata = { capacity: req.body.capacity, sensorName: req.params.sensorName};
    const queryFilter = {sensorName: req.params.sensorName}
    const result = await measurementService.setMeasurement(measurementdata, queryFilter);
    console.log("Setting measurement: " + req.params.sensorName + req.body.capacity)
    console.log(result)
    const prefs = await preferenceService.getPreference(req.params.sensorName);
    console.log(prefs)
    await irrigationService.irrigateIfNeeded(req.body.capacity, req.params.sensorName);
    const pendingirrigation = await irrigationService.getPendingIrrigations(req.params.sensorName);
    console.log(pendingirrigation)
    irrigationService.clearPendingIrrigations(req.params.sensorName);
    res.json({ ...prefs, pendingirrigation })
};
