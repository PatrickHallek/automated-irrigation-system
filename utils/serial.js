const cron = require("node-cron");
const preferenceService = require("../services/preference-service")
const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")
const sensorService = require("../services/sensor-service")
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const serial = require('./serial')

exports.connect = async () => {
    const serialList = await SerialPort.list()
    if (serialList.length < 1) return reconnecting()
    const port = new SerialPort(serialList[0].path, {
        baudRate: 9600
    })
    const parser = new Readline()
    port.pipe(parser)
    port.on('open', open => console.log('Port open on baud rate: ' + port.baudRate));
    port.on('close', close => {
        console.log('Port closed. Reconnecting...')
        reconnecting()
    });
    port.on('error', error => {
        console.log(error)
        reconnecting()
    });

    parser.on('data', async currentCapacity => {
        console.log(currentCapacity)
        const preferences = await preferenceService.getPreferences()
        measurementService.setMeasurement(currentCapacity)
        if (await isLastIrrigationTimeBufferPassed(preferences) && await isCapacityMinimumReached(preferences)) {
            irrigationService.setIrregation(currentCapacity)
            sensorService.waterPlants(preferences.irrigationTimeInSeconds)
        }
        port.write("Hello");
    })
}

function reconnecting() {
    setTimeout(() => {
        serial.connect();
    }, 1000)
}

async function isLastIrrigationTimeBufferPassed(preferences) {
    const lastMeasurement = await irrigationService.getLastIrrigation()
    const now = new Date().getTime()
    if (lastMeasurement) {
        let lastMeasurementTime = lastMeasurement.timestamp
        lastMeasurementTimePlusBuffer = lastMeasurementTime.setMinutes(lastMeasurementTime.getMinutes() + preferences.minIrrigationIntervalInMinutes)
        return now > lastMeasurementTimePlusBuffer
    } else return true
}

async function isCapacityMinimumReached(preferences) {
    return await measurementService.getCapacityMeanValue(preferences.capacityMeanBuffer) < preferences.capacityBuffer
}
