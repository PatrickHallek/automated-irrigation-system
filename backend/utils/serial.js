const cron = require("node-cron");
const preferenceService = require("../services/preference-service")
const measurementService = require("../services/measurement-service")
const irrigationService = require("../services/irrigation-service")
const sensorService = require("../services/sensor-service")
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const serial = require('./serial')

exports.connect = async () => {
    const port = new SerialPort('/dev/ttyAMA0', {
        baudRate: 9600
    })
    const parser = new Readline()

    port.pipe(parser)
    port.on('open', open => console.log('Port open on baud rate: ' + port.baudRate));
    port.on('close', close => {
        console.log('Port closed.')
        reconnect()
    });
    port.on('error', error => {
        console.log(error)
        reconnect()
    });

    parser.on('data', async currentCapacity => {
        console.log(currentCapacity)
        irrigateIfNeeded(currentCapacity)
    })
}

function reconnect() {
    console.log('Try to reconnect...')
    setTimeout(() => {
        serial.connect();
    }, 5000)
}

async function irrigateIfNeeded(currentCapacity) {
    const preferences = await preferenceService.getPreferences()
    measurementService.setMeasurement(currentCapacity)
    if (await isLastIrrigationTimeBufferPassed(preferences) && currentCapacity < preferences.capacityBuffer) {
        irrigationService.setIrregation(currentCapacity)
        sensorService.irrigate(preferences.irrigationTimeInSeconds)
    }
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
