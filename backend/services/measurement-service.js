const DailyMeasurement = require("../models/measurements/daily-measurement");
const HourlyMeasurement = require("../models/measurements/hourly-measurement");
const MinutelyMeasurement = require("../models/measurements/minutely-measurement");
const SecondlyMeasurement = require("../models/measurements/secondly-measurement");

exports.setMeasurement = async (capacity, sensorName) => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const currentDay = new Date(Math.floor(new Date().getTime() / day) * day);
    const currentHour = new Date(Math.floor(new Date().getTime() / hour) * hour);
    const currentMinute = new Date(Math.floor(new Date().getTime() / minute) * minute);
    const currentDate = new Date();

    let result = [];
    result.push(await updateMeasurement(DailyMeasurement, currentDay, capacity, sensorName));
    result.push(await updateMeasurement(HourlyMeasurement, currentHour, capacity, sensorName));
    result.push(await updateMeasurement(MinutelyMeasurement, currentMinute, capacity, sensorName));
    result.push(await updateMeasurement(SecondlyMeasurement, currentDate, capacity, sensorName));

    return result;
};

const updateMeasurement = async (collection, timestamp, capacity, sensorName) => {
    return await collection.updateOne({
        timestamp
    }, {
        capacity,
        sensorName
    }, {
        upsert: true,
    })
}

exports.getDailyMeasurements = async (queryFilter) => {
    return DailyMeasurement.find(queryFilter);
};

exports.getHourlyMeasurements = async (queryFilter) => {
    return HourlyMeasurement.find(queryFilter);
};

exports.getMinutelyMeasurements = async (queryFilter) => {
    return MinutelyMeasurement.find(queryFilter);
};

exports.getSecondlyMeasurements = async (queryFilter) => {
    return SecondlyMeasurement.find(queryFilter);
};
