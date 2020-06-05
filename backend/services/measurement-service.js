const DailyMeasurement = require("../models/measurements/daily-measurement");
const HourlyMeasurement = require("../models/measurements/hourly-measurement");
const MinutelyMeasurement = require("../models/measurements/minutely-measurement");
const SecondlyMeasurement = require("../models/measurements/secondly-measurement");

exports.setMeasurement = async (capacity) => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const currentDay = new Date(Math.floor(new Date().getTime() / day) * day);
    const currentHour = new Date(Math.floor(new Date().getTime() / hour) * hour);
    const currentMinute = new Date(Math.floor(new Date().getTime() / minute) * minute);
    const currentDate = new Date();

    let result = [];
    result.push(await updateMeasurement(DailyMeasurement, currentDay, capacity));
    result.push(await updateMeasurement(HourlyMeasurement, currentHour, capacity));
    result.push(await updateMeasurement(MinutelyMeasurement, currentMinute, capacity));
    result.push(await updateMeasurement(SecondlyMeasurement, currentDate, capacity));

    return result;
};

const updateMeasurement = async (collection, timestamp, capacity) => {
    return await collection.updateOne({
        timestamp
    }, {
        capacity,
    }, {
        upsert: true,
    })
}

exports.getDailyMeasurements = async (queryFilter) => {
    return await DailyMeasurement.find(queryFilter);
};

exports.getHourlyMeasurements = async (queryFilter) => {
    return await HourlyMeasurement.find(queryFilter);
};

exports.getMinutelyMeasurements = async (queryFilter) => {
    return await MinutelyMeasurement.find(queryFilter);
};

exports.getSecondlyMeasurements = async (queryFilter) => {
    return await SecondlyMeasurement.find(queryFilter);
};
