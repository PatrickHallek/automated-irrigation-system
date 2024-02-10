const DailyMeasurement = require("../models/measurements/daily-measurement");
const HourlyMeasurement = require("../models/measurements/hourly-measurement");
const MinutelyMeasurement = require("../models/measurements/minutely-measurement");
const SecondlyMeasurement = require("../models/measurements/secondly-measurement");

exports.setMeasurement = async (measurementdata, queryFilter) => {
    const lastDailyMeasurement = await DailyMeasurement.findOne(queryFilter).sort({ timestamp: -1 });
    console.log("lastDailyMeasurement: ");
    console.log(lastDailyMeasurement);
    console.log("Timestamp: ");
    console.log(lastDailyMeasurement.timestamp);
    var update = true;
    if (lastDailyMeasurement) {
        if(lastDailyMeasurement.timestamp.getDay() < Date().getDay()){update = false;}
    } 
    if(update){DailyMeasurement.create(measurementdata);}
    
    const lastHourlyMeasurement = await HourlyMeasurement.findOne(queryFilter).sort({ timestamp: -1 });
    var update = true;
    if (lastHourlyMeasurement) {
        if (lastHourlyMeasurement.timestamp.getHours() < Date().getHours()){update = false;}
        
    } 
    if(update){HourlyMeasurement.create(measurementdata);}
    MinutelyMeasurement.create(measurementdata);
    SecondlyMeasurement.create(measurementdata);
    result = [];
    return result;
};

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
