const DailyMeasurement = require("../models/measurements/daily-measurement");
const HourlyMeasurement = require("../models/measurements/hourly-measurement");
const MinutelyMeasurement = require("../models/measurements/minutely-measurement");
const SecondlyMeasurement = require("../models/measurements/secondly-measurement");

exports.setMeasurement = async (measurementdata, queryFilter) => {
    const lastDailyMeasurement = DailyMeasurement.findOne(queryFilter).sort({ timestamp: -1 });
        if (!lastDailyMeasurement || lastDailyMeasurement.timestamp.getDay() < Date().getDay()) {
            DailyMeasurement.create(measurementdata);
    } 

    const lastHourlyMeasurement = HourlyMeasurement.findOne(queryFilter).sort({ timestamp: -1 });
        if (!lastHourlyMeasurement || lastHourlyMeasurement.timestamp.getHours() < Date().getHours()) {
            HourlyMeasurement.create(measurementdata);
    } 
    MinutelyMeasurement.create(measurementdata);
    SecondlyMeasurement.create(measurementdata);
    result = [];
    return result;
};

const updateMeasurement = async (collection, vtimestamp, vcapacity, vsensorName) => {
    return collection.findOneAndUpdate({
        timestamp: vtimestamp,
        sensorName: vsensorName
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
