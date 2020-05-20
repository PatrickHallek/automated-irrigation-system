const Measurement = require('../models/measurements');
const QueryFilter = require('../utils/query-filter');

exports.getCapacityMeanValue = async (capacityMeanBuffer) => {
    measurements = await Measurement.find().limit(capacityMeanBuffer).sort({ timestamp: -1 })
    measurementsMeanValue = measurements.reduce((sum, measurement) => {
        return sum + parseFloat(measurement.capacity);
    }, 0) / measurements.length;
    return measurementsMeanValue
}

exports.getMeasurements = async (filter, startDate, endDate) => {
    const { id, match } = QueryFilter.getTimefilterQuery(filter);
    return await Measurement.aggregate([
        {
            $match: match
        },
        {
            $group: {
                '_id': id,
                timestamp: {
                    $first: "$timestamp"
                },
                capacity: {
                    $avg: '$capacity'
                }
            },
        },
        {
            $sort: { timestamp: 1 }
        }
    ])
}

exports.setMeasurement = async (currentCapacity) => {
    return await Measurement.create({ capacity: currentCapacity })
}
