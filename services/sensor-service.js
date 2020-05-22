exports.getCurrentCapacity = () => {
    return new Promise((resolve) => {
        resolve(Math.random() * 50)
    })
}

exports.irrigate = async (irrigationTimeInSeconds) => {
    console.log("Start Irrigation...")
    // relay on
    await irrigatonTimeout(irrigationTimeInSeconds)
    // relay off
    console.log("Stop Irrigation...")
    return "Success"
}

const irrigatonTimeout = (irrigationTimeInSeconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, irrigationTimeInSeconds * 1000)
    })
}
