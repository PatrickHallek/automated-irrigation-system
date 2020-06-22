import SecondlyMeasurement from "../models/measurements/secondly-measurement";
import MinutelyMeasurement from "../models/measurements/minutely-measurement";
import HourlyMeasurement from "../models/measurements/hourly-measurement";
import DailyMeasurement from "../models/measurements/daily-measurement";

export class MeasurementSerivce {

    constructor(DailyMeasurement, HourlyMeasurement, MinutelyMeasurement, SecondlyMeasurement) {
        this.secondlyMeasurement = SecondlyMeasurement
        this.minutelyMeasurement = MinutelyMeasurement
        this.hourlyMeasurement = HourlyMeasurement
        this.dailyMeasurement = DailyMeasurement
    }

    async setMeasurement(capacity, sensorName) {
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;

        const currentDay = new Date(Math.floor(new Date().getTime() / day) * day);
        const currentHour = new Date(Math.floor(new Date().getTime() / hour) * hour);
        const currentMinute = new Date(Math.floor(new Date().getTime() / minute) * minute);
        const currentDate = new Date();

        let result = [];
        result.push(await this.updateMeasurement(this.secondlyMeasurement, currentDate, capacity, sensorName));
        result.push(await this.updateMeasurement(this.minutelyMeasurement, currentMinute, capacity, sensorName));
        result.push(await this.updateMeasurement(this.hourlyMeasurement, currentHour, capacity, sensorName));
        result.push(await this.updateMeasurement(this.dailyMeasurement, currentDay, capacity, sensorName));

        return result;
    }

    async updateMeasurement(collection, timestamp, capacity, sensorName) {
        return await collection.updateOne({
            timestamp
        }, {
            capacity,
            sensorName
        }, {
            upsert: true,
        })
    }
    async getSecondlyMeasurements(queryFilter) {
        return await SecondlyMeasurement.find(queryFilter);
    }

    async getMinutelyMeasurements(queryFilter) {
        return await MinutelyMeasurement.find(queryFilter);
    }

    async getHourlyMeasurements(queryFilter) {
        return await HourlyMeasurement.find(queryFilter);
    }

    async getDailyMeasurements(queryFilter) {
        return await DailyMeasurement.find(queryFilter);
    }


}
