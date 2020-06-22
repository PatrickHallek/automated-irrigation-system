import { IrrigationSerivce } from "../services/irrigation-service";

export class IrrigationController {

    async getIrrigations(req, res, next) {
        res.json(await IrrigationSerivce.getIrrigations(req.params.sensorName));
    }
}
