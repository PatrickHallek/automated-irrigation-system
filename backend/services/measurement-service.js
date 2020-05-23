const Measurement = require('../models/measurements');
const QueryFilter = require('../utils/query-filter');

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
