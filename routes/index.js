const express = require('express');
const router = express.Router();
const IrrigationController = require("../controller/irrigation-controller");
const MeasurementController = require("../controller/measurement-controller");
const PreferenceController = require("../controller/preference-controller");
const SensorController = require("../controller/sensor-controller");

/* GET home page. */
router.get('/measurements/:filter', MeasurementController.getMeasurements);
router.get('/irrigations/:filter', IrrigationController.getIrrigations);
router.get('/sensors/irrigation', SensorController.irrigation);
router.get('/preferences', PreferenceController.getPreferences);

router.put('/preferences', PreferenceController.updatePreferences);

module.exports = router;
