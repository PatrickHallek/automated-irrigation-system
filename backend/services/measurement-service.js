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
    result.push(updateMeasurement(DailyMeasurement, currentDay, capacity, sensorName));
    result.push(updateMeasurement(HourlyMeasurement, currentHour, capacity, sensorName));
    result.push(updateMeasurement(MinutelyMeasurement, currentMinute, capacity, sensorName));
    result.push(updateMeasurement(SecondlyMeasurement, currentDate, capacity, sensorName));

    return result;
};

const updateMeasurement = (collection, vtimestamp, vcapacity, vsensorName) => {
    return collection.findOneAndUpdate({
        timestamp: vtimestamp,
        sensorName: vsensorname
    }, {
        capacity: vcapacity
    }, {
        upsert: true,
    })
}

exports.getDailyMeasurements = (queryFilter) => {
    return DailyMeasurement.find(queryFilter);
};

exports.getHourlyMeasurements = (queryFilter) => {
    return HourlyMeasurement.find(queryFilter);
};

exports.getMinutelyMeasurements = (queryFilter) => {
    return MinutelyMeasurement.find(queryFilter);
};

exports.getSecondlyMeasurements = (queryFilter) => {
    return SecondlyMeasurement.find(queryFilter);
};
