const express = require('express');
const router = express.Router();
const IrrigationController = require("../controller/irrigation-controller");
const MeasurementController = require("../controller/measurement-controller");

/* GET home page. */
router.get('/measurements/:filter', MeasurementController.getMeasurements);
router.get('/irrigations/:filter', IrrigationController.getIrrigations);

module.exports = router;
