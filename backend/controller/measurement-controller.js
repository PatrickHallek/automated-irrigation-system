import { MeasurementSerivce } from "../services/measurement-service";
import { IrrigationSerivce } from "../services/irrigation-service";

export class MeasurementController {

    async getLastMinuteMeasurements(req, res, next) {
        const queryFilter = {
            sensorName: req.params.sensorName,
            timestamp: {
                $lte: new Date(),
                $gte: new Date(new Date().setMinutes(new Date().getMinutes() - 1))
            }
        }
        res.json(await MeasurementSerivce.getSecondlyMeasurements(queryFilter));
    }

    async getLastHourMeasurements(req, res, next) {
        const queryFilter = {
            sensorName: req.params.sensorName,
            timestamp: {
                $lte: new Date(),
                $gte: new Date(new Date().setHours(new Date().getHours() - 1))
            }
        }
        res.json(await MeasurementSerivce.getMinutelyMeasurements(queryFilter));
    }

    async getLastDayMeasurements(req, res, next) {
        const queryFilter = {
            sensorName: req.params.sensorName,
            timestamp: {
                $lte: new Date(),
                $gte: new Date(new Date().setDate(new Date().getDate() - 1))
            }
        }
        res.json(await MeasurementSerivce.getHourlyMeasurements(queryFilter));
    }

    async getLastWeekMeasurements(req, res, next) {
        const queryFilter = {
            sensorName: req.params.sensorName,
            timestamp: {
                $lte: new Date(),
                $gte: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        }
        res.json(await MeasurementSerivce.getHourlyMeasurements(queryFilter));
    }

    async getLastMonthMeasurements(req, res, next) {
        const queryFilter = {
            sensorName: req.params.sensorName,
            timestamp: {
                $lte: new Date(),
                $gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
            }
        }
        res.json(await MeasurementSerivce.getDailyMeasurements(queryFilter));
    }

    async getAllMeasurements(req, res, next) {
        const queryFilter = {
            sensorName: req.params.sensorName
        }
        res.json(await MeasurementSerivce.getDailyMeasurements(queryFilter));
    }

    async setMeasurement(req, res, next) {
        console.log(req.body.capacity)
        const result = await MeasurementSerivce.setMeasurement(req.body.capacity, req.params.sensorName);
        const irrigated = await IrrigationSerivce.irrigateIfNeeded(req.body.capacity, req.params.sensorName);
        res.json({ ...result, irrigated })
    }
}
