const preferenceService = require("../services/preference-service")
const sensorService = require("../services/sensor-service")
const data1 = require('../models/measurements/daily-measurement')
const data2 = require('../models/measurements/hourly-measurement')
const data3 = require('../models/measurements/minutely-measurement')
const data4 = require('../models/measurements/secondly-measurement')
const prefdata = require('../models/preferences')


exports.getSensorNames = async (req, res, next) => {
    res.json(await preferenceService.getPreferences())
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

exports.getmdns = async (req, res, next) => {
    res.json(await sensorService.getMDNS())
    res.status(200);
    res.json("Success");
};
