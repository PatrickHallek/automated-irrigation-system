const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const MeasurementController = require("../controller/measurement-controller");
const PreferenceController = require("../controller/preference-controller");
const SensorController = require("../controller/sensor-controller");
const IrrigationController = require("../controller/irrigation-controller");
const SensorService = require("../services/sensor-service");

const measurementLimiter = rateLimit({
    windowMs: 1000, // time window
    max: 2, // start blocking after 5 requests
    message: "Too many measurements this IP"
});

/* GET home page. */
router.get('/measurements/all/:sensorName', MeasurementController.getAllMeasurements);
router.get('/measurements/month/:sensorName', MeasurementController.getLastMonthMeasurements);
router.get('/measurements/week/:sensorName', MeasurementController.getLastWeekMeasurements);
router.get('/measurements/day/:sensorName', MeasurementController.getLastDayMeasurements);
router.get('/measurements/hour/:sensorName', MeasurementController.getLastHourMeasurements);
router.get('/measurements/minute/:sensorName', MeasurementController.getLastMinuteMeasurements);
router.post('/measurement/:sensorName', measurementLimiter, MeasurementController.setMeasurement);

router.get('/irrigate/:sensorName', IrrigationController.irrigate);
router.get('/irrigations/:sensorName', IrrigationController.getIrrigations);

router.get('/sensors', SensorController.getSensorNames);
router.get('/networksensors', SensorService.getMDNS);
router.get('/sensors/deletedata/:sensorName', SensorController.deletedata);
router.get('/sensors/deletesensor/:sensorName', SensorController.deletesensor);

router.get('/preferences', PreferenceController.getPreferences);
router.get('/preferences/:sensorName', PreferenceController.getPreference);
router.put('/preferences/:sensorName', PreferenceController.updatePreferences);


module.exports = router;
