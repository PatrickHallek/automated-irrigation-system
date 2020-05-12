const Measurement = require('../models/measurements');
const QueryFilter = require('../utils/query-filter');

exports.getCapacityMeanValue = async (capacityMeanBuffer) => {
    measurements = await Measurement.find().limit(capacityMeanBuffer).sort({ timestamp: -1 })
    measurementsMeanValue = measurements.reduce((sum, measurement) => {
        return sum + parseFloat(measurement.capacity);
    }, 0) / measurements.length;
    return measurementsMeanValue
}

exports.getMeasurements = async (filter) => {

    return await Measurement.aggregate([
        {
            $group: {
                '_id': QueryFilter.getTimefilterQuery(filter),
                timestamp: {
                    $first: "$timestamp"
                },
                capacity: {
                    $first: '$capacity'
                }
            }
        }
    ])
}

exports.setMeasurement = async (currentCapacity) => {
    return await Measurement.create({ capacity: currentCapacity })
}