// import { open, OUTPUT, LOW, write, HIGH, sleep, close } from 'rpio';

import { PreferenceService } from "./preference-service";

export class SensorSerivce {

    async irrigate(irrigationTimeInSeconds, sensorName) {
        const preferences = await PreferenceService.getPreference(sensorName)
        console.log("Start Irrigation...")
        open(preferences.signalPin, OUTPUT, LOW);
        write(preferences.signalPin, HIGH);
        sleep(irrigationTimeInSeconds);
        write(preferences.signalPin, LOW);
        close(preferences.signalPin);
        return "Success"
    }

    async getSensorNames() {
        const preferences = await PreferenceService.getPreferences()
        return preferences.map(preference => preference.sensorName)
    }
}
