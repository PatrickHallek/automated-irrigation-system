exports.getCurrentCapacity = () => {
    return new Promise((resolve) => {
        resolve(Math.random() * 50)
    })
}

exports.waterPlants = async (irrigationTimeInSeconds) => {
    console.log("Watering...")
    // relay on
    await wateringTimeout(irrigationTimeInSeconds)
    // relay off
    console.log("Stop Watering...")
    return "Success"
}

const wateringTimeout = (irrigationTimeInSeconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, irrigationTimeInSeconds * 1000)
    })
}
