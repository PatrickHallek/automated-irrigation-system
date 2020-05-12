exports.getTimefilterQuery = (filter) => {
    switch (filter) {
        case "year":
            return {
                'year': { '$year': "$timestamp" }
            }
            break
        case "month":
            return {
                'year': { '$year': "$timestamp" },
                'month': { '$month': "$timestamp" }
            }
            break
        case "week":
            return {
                'year': { '$year': "$timestamp" },
                'month': { '$month': "$timestamp" },
                'week': { '$week': "$timestamp" }
            }
            break
        case "day":
            return {
                'year': { '$year': "$timestamp" },
                'month': { '$month': "$timestamp" },
                'day': { '$dayOfMonth': "$timestamp" }
            }
            break
        case "hour":
            return {
                'year': { '$year': "$timestamp" },
                'month': { '$month': "$timestamp" },
                'day': { '$dayOfMonth': "$timestamp" },
                'hour': { '$hour': "$timestamp" },
            }
            break
        case "minute":
            return {
                'year': { '$year': "$timestamp" },
                'month': { '$month': "$timestamp" },
                'day': { '$dayOfMonth': "$timestamp" },
                'hour': { '$hour': "$timestamp" },
                'minute': { '$minute': "$timestamp" }
            }
            break
        default:
            return {}
    }
}