exports.getTimefilterQuery = (filter) => {
    switch (filter) {
        case "month":
            return {
                match: { "timestamp": { $lte: new Date(), $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } },
                id: {
                    'year': { '$year': "$timestamp" },
                    'month': { '$month': "$timestamp" },
                    'week': { '$week': "$timestamp" },
                    'day': { '$dayOfMonth': "$timestamp" }
                }
            }
        case "week":
            return {
                match: { "timestamp": { $lte: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
                id: {
                    'year': { '$year': "$timestamp" },
                    'month': { '$month': "$timestamp" },
                    'week': { '$week': "$timestamp" },
                    'day': { '$dayOfMonth': "$timestamp" }
                }
            }
        case "day":
            return {
                match: { "timestamp": { $lte: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 1)) } },
                id: {
                    'year': { '$year': "$timestamp" },
                    'month': { '$month': "$timestamp" },
                    'day': { '$dayOfMonth': "$timestamp" },
                    'hour': { '$hour': "$timestamp" }
                }
            }
        case "hour":
            return {
                match: { "timestamp": { $lte: new Date(), $gte: new Date(new Date().setHours(new Date().getHours() - 1)) } },
                id: {
                    'year': { '$year': "$timestamp" },
                    'month': { '$month': "$timestamp" },
                    'day': { '$dayOfMonth': "$timestamp" },
                    'hour': { '$hour': "$timestamp" },
                    'minute': { '$minute': "$timestamp" }
                }
            }
        case "minute":
            return {
                match: { "timestamp": { $lte: new Date(), $gte: new Date(new Date().setMinutes(new Date().getMinutes() - 1)) } },
                id: "$_id"
            }
        case "all":
            return {
                match: null,
                id: "$_id"
            }
        default:
            return
    }
}
