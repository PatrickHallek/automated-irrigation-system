exports.getCurrentCapacity = () => {
    return new Promise((resolve) => {
        resolve(Math.random()*50)
    })
}

exports.waterPlants = async (wateringTimeInSeconds) => {

    console.log("Watering...")
    // relay on
    await wateringTimeout(wateringTimeInSeconds)
    // relay off
    console.log("Stop Watering...")
    return 20
}

const wateringTimeout = (wateringTimeInSeconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, wateringTimeInSeconds * 1000)
    })
}
