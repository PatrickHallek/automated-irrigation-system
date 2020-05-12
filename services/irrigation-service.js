const Irrigation = require('../models/irrigations');
const QueryFilter = require('../utils/query-filter');

exports.getLastIrrigation = async () => {
    return await Irrigation.findOne().sort({ timestamp: -1 });
}

exports.setIrregation = async (currentCapacity) => {
    return await Irrigation.create({ capacity: currentCapacity })
}


exports.getIrrigations = async (filter) => {
    return await Irrigation.aggregate([
        {
            $group: {
                '_id': QueryFilter.getTimefilterQuery(filter),
                timestamp: {
                    $last: "$timestamp"
                },
                capacity: {
                    $last: '$capacity'
                }
            }
        }
    ])
}