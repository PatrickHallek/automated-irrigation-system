import { PreferenceService } from "../services/preference-service";

export class PreferenceController {

    async getPreference(req, res, next) {
        res.json(await PreferenceService.getPreference(req.params.sensorName));
    }

    async updatePreferences(req, res, next) {
        res.json(await PreferenceService.updatePreferences(req.body, req.params.sensorName));
    }
}
