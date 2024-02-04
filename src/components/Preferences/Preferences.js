/** @jsx jsx */
import { jsx } from "theme-ui";
import "./Preferences.css";
import { useState, useEffect } from "react";

const Preferences = props => {
  const sensorName = props.sensorInFocus
  const [preferences, setPreferences, databasePreferences, setDatabasePreferences] = useState({
    minIrrigationIntervalInMinutes: 0,
    irrigationTimeInSeconds: 0,
    capacityBuffer: 0,
    outputSensor: "Local",
    Nickname:"Friendlyname",
    Batterypower:1,
    ReadingIntervalInMinutes:0,
    signalPin: 0
  });
  /* 
    const [databasePreferences, setDatabasePreferences] = useState({
    minIrrigationIntervalInMinutes: 0,
    irrigationTimeInSeconds: 0,
    capacityBuffer: 0,
    outputSensor: `Local`,
    Nickname:"Friendlyname",
    Batterypower:true,
    ReadingIntervalInMinutes:0,
    signalPin: 0
  });
   */
  useEffect(() => {
    if (sensorName) {
      fetch(document.URL.replace(":5000", ":3000")+`preferences/${sensorName}`)
        .then(res => res.json())
        .then(
          async (preferences) => {
            setDatabasePreferences({ ...preferences})
            setPreferences({ ...preferences})
          },
          (error) => {
            console.log(`Coudn't fetch data. Error: ${error}`)
          }
        )
    }
  }, [setPreferences, sensorName])


  const updatePreferences = (e, key) => {
    fetch(document.URL.replace(":5000", ":3000")+`preferences/${sensorName}`, {
      headers: { 'Content-Type': 'application/json', },
      method: 'PUT',
      body: JSON.stringify({ ...preferences})
    })
      .then(res => res.json())
      .then(
        async (preferences) => {
          setDatabasePreferences({ ...preferences})
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  const preferenceBorderColor = (key) => {
    return preferences[key] === databasePreferences[key] ? "#161A30 !important" : "var(--primary) !important"
  }

  const preferenceButtonColor = () => {
    return JSON.stringify({
      minIrrigationIntervalInMinutes: preferences.minIrrigationIntervalInMinutes,
      irrigationTimeInSeconds: preferences.irrigationTimeInSeconds,
      capacityBuffer: preferences.capacityBuffer,
      outputSensor: preferences.outputSensor,
      Nickname: preferences.Nickname,
      Batterypower: preferences.Batterypower,
      ReadingIntervalInMinutes: preferences.ReadingIntervalInMinutes,
      signalPin: preferences.signalPin
    }) === JSON.stringify({
      minIrrigationIntervalInMinutes: databasePreferences.minIrrigationIntervalInMinutes,
      irrigationTimeInSeconds: databasePreferences.irrigationTimeInSeconds,
      capacityBuffer: databasePreferences.capacityBuffer,
      outputSensor: databasePreferences.outputSensor,
      Nickname: databasePreferences.Nickname,
      Batterypower: databasePreferences.Batterypower,
      ReadingIntervalInMinutes: databasePreferences.ReadingIntervalInMinutes,
      signalPin: databasePreferences.signalPin
    }) ? "#161A30 !important" : "var(--primary) !important"
  }
  var outputname = "";
  var outputsens = props.sensors.find(obj => {return obj.sensorName === preferences.outputSensor});
  if (outputsens === undefined) {outputname = "Local"} else {outputname = outputsens.Nickname}
  var batterypref = "";
  if (preferences.Batterypower === 1) {batterypref = "Battery"} else {batterypref = "Plug-in"}
  return (
    <h3 sx={{ color: "text" }}>
     <div className="preference">
        <h3>Sensor Name:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("Nickname") }} type="text"
          onChange={(e) => setPreferences({ ...preferences, Nickname: e.target.value })}
          value={preferences.Nickname} />
      </div>
      <div className="preference">
        <h3>Irrigation time [s]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("irrigationTimeInSeconds") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, irrigationTimeInSeconds: parseInt(e.target.value) })}
          value={preferences.irrigationTimeInSeconds} />
      </div>
      <div className="preference">
        <h3>Irrigation time interval [min]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("minIrrigationIntervalInMinutes") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, minIrrigationIntervalInMinutes: parseInt(e.target.value) })}
          value={preferences.minIrrigationIntervalInMinutes} />
      </div>
      <div className="preference">
        <h3>Minimum soil moisture:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("capacityBuffer") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, capacityBuffer: parseInt(e.target.value) })}
          value={preferences.capacityBuffer} />
      </div>
      <div className="preference">
        <h3>Output Sensor:</h3>
        <select sx={{ color: "text", borderColor: preferenceBorderColor("outputSensor") }}
          onChange={(e) => setPreferences({ ...preferences, outputSensor: e.target.value })}>
            <option value={preferences.outputSensor} selected> {outputname} </option>
            <option value="Local"> Local </option>
            {props.sensors.map((sensor) => <option value={sensor.sensorName}> {sensor.Nickname} </option>)}
        </select>
      </div>
      <div className="preference">
        <h3>Output Signal Pin:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("signalPin") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, signalPin: parseInt(e.target.value) })}
          value={preferences.signalPin} />
      </div>
      <div className="preference">
        <h3>Power Type:</h3>
        <select sx={{ color: "text", borderColor: preferenceBorderColor("Batterypower") }}
          onChange={(e) => setPreferences({ ...preferences, Batterypower: parseInt(e.target.value) })}>
            <option value={preferences.Batterypower} selected> {batterypref} </option>
            <option value="0"> Plug-in </option>
            <option value="1"> Battery </option>
        </select>
      </div>
      <div className="preference">
        <h3>Sensor update interval [min]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("ReadingIntervalInMinutes") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, ReadingIntervalInMinutes: parseInt(e.target.value) })}
          value={preferences.ReadingIntervalInMinutes} />
      </div>      
      <div className="preference">
        <div></div>
        <button sx={{ color: "text", borderColor: preferenceButtonColor() }} onClick={() => updatePreferences()}>Submit</button>
      </div>
    </h3>
  );
};

export default Preferences;
