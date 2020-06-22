import { IrrigationSerivce } from "../services/irrigation-service";
import { SensorSerivce } from "../services/sensor-service";
import { PreferenceService } from "../services/preference-service";

export class SensorController {

    async getSensorNames(req, res, next) {
        res.json(await getSensorNames())
    }

    async irrigation(req, res, next) {
        const preferences = await PreferenceService.getPreference(req.params.sensorName);
        const sensorResult = await SensorSerivce.irrigate(preferences.irrigationTimeInSeconds, req.params.sensorName);
        if (sensorResult) {
            await IrrigationSerivce.setIrregation(null).then(() => {
                res.status(200);
                res.json("Success");
            });
        } else {
            res.status(500);
            res.json("Failed");
        }

    }
}
