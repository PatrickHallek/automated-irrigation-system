import { Router } from "express";
import rateLimit from "express-rate-limit";

import { MeasurementController } from "../controller/measurement-controller";
import { IrrigationController } from "../controller/irrigation-controller";
import { PreferenceController } from "../controller/preference-controller";
import { SensorController } from "../controller/sensor-controller";

const router = Router();
const measurementLimiter = rateLimit({
    windowMs: 1000, // time window
    max: 2, // start blocking after n requests
    message: "Too many measurements this IP"
});

const measurementController = new MeasurementController()
const irrigationController = new IrrigationController()
const sensorController = new SensorController()
const preferenceController = new PreferenceController()

router.get('/measurements/minute/:sensorName', measurementController.getLastMinuteMeasurements);
router.get('/measurements/hour/:sensorName', measurementController.getLastHourMeasurements);
router.get('/measurements/day/:sensorName', measurementController.getLastDayMeasurements);
router.get('/measurements/week/:sensorName', measurementController.getLastWeekMeasurements);
router.get('/measurements/month/:sensorName', measurementController.getLastMonthMeasurements);
router.get('/measurements/all/:sensorName', measurementController.getAllMeasurements);
router.post('/measurement/:sensorName', measurementLimiter, measurementController.setMeasurement);

router.get('/irrigations/:sensorName', irrigationController.getIrrigations);

router.get('/sensors', sensorController.getSensorNames);
router.get('/sensors/irrigation/:sensorName', sensorController.irrigation);

router.get('/preferences/:sensorName', preferenceController.getPreference);
router.put('/preferences/:sensorName', preferenceController.updatePreferences);


export default router;
