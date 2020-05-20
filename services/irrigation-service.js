const Irrigation = require('../models/irrigations');
const QueryFilter = require('../utils/query-filter');

exports.getLastIrrigation = async () => {
    return await Irrigation.findOne().sort({ timestamp: -1 });
}

exports.setIrregation = async (currentCapacity) => {
    return await Irrigation.create({ capacity: currentCapacity })
}

exports.getIrrigations = async (filter) => {
    const { id } = QueryFilter.getTimefilterQuery(filter);
    return await Irrigation.aggregate([
        {
            $group: {
                '_id': id,
                timestamp: {
                    $last: "$timestamp"
                },
                capacity: {
                    $last: '$capacity'
                },
            },
            $sort: { "timestamp": 1 }
        }
    ])
}
