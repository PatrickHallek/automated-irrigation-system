const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const IrrigationController = require("../controller/irrigation-controller");
const MeasurementController = require("../controller/measurement-controller");
const PreferenceController = require("../controller/preference-controller");
const SensorController = require("../controller/sensor-controller");

const measurementLimiter = rateLimit({
    windowMs: 20000, // 1 hour window
    max: 1, // start blocking after 5 requests
    message: "Too many measurements this IP"
});

/* GET home page. */
router.get('/measurements/:filter', MeasurementController.getMeasurements);
router.get('/irrigations/:filter', IrrigationController.getIrrigations);
router.get('/sensors/irrigation', SensorController.irrigation);
router.get('/preferences', PreferenceController.getPreferences);

router.put('/preferences', PreferenceController.updatePreferences);

router.post('/measurement', measurementLimiter, MeasurementController.setMeasurement);

module.exports = router;
