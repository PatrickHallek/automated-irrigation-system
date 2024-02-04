const irrigationService = require("../services/irrigation-service")
const sensorService = require("../services/sensor-service")
const preferenceService = require("../services/preference-service")
const data1 = require('../models/measurements/daily-measurement')
const data2 = require('../models/measurements/hourly-measurement')
const data3 = require('../models/measurements/minutely-measurement')
const data4 = require('../models/measurements/secondly-measurement')
const prefdata = require('../models/preferences')

exports.getSensorNames = async (req, res, next) => {
    res.json(await sensorService.getSensorNames())
};

exports.irrigation = async (req, res, next) => {
    const preferences = await preferenceService.getPreference(req.params.sensorName);
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

exports.deletesensor = async (req, res, next) => {
    await data1.deleteMany({ sensorName: req.params.sensorName });
    await data2.deleteMany({ sensorName: req.params.sensorName });
    await data3.deleteMany({ sensorName: req.params.sensorName });
    await data4.deleteMany({ sensorName: req.params.sensorName });
    await prefdata.deleteMany({ sensorName: req.params.sensorName });
    res.status(200);
    res.json("Success");
};

exports.deletedata = async (req, res, next) => {
    await data1.deleteMany({ sensorName: req.params.sensorName });
    await data2.deleteMany({ sensorName: req.params.sensorName });
    await data3.deleteMany({ sensorName: req.params.sensorName });
    await data4.deleteMany({ sensorName: req.params.sensorName });
    res.status(200);
    res.json("Success");
};
