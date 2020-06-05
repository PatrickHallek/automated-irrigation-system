const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const IrrigationController = require("../controller/irrigation-controller");
const MeasurementController = require("../controller/measurement-controller");
const PreferenceController = require("../controller/preference-controller");
const SensorController = require("../controller/sensor-controller");

const measurementLimiter = rateLimit({
    windowMs: 20000, // time window
    max: 1, // start blocking after 5 requests
    message: "Too many measurements this IP"
});

/* GET home page. */
router.get('/measurements/all', MeasurementController.getAllMeasurements);
router.get('/measurements/month', MeasurementController.getLastMonthMeasurements);
router.get('/measurements/week', MeasurementController.getLastWeekMeasurements);
router.get('/measurements/day', MeasurementController.getLastDayMeasurements);
router.get('/measurements/hour', MeasurementController.getLastHourMeasurements);
router.get('/measurements/minute', MeasurementController.getLastMinuteMeasurements);
router.post('/measurement', measurementLimiter, MeasurementController.setMeasurement);

router.get('/irrigations', IrrigationController.getIrrigations);

router.get('/sensors/irrigation', SensorController.irrigation);

router.get('/preferences', PreferenceController.getPreferences);
router.put('/preferences', PreferenceController.updatePreferences);


module.exports = router;
