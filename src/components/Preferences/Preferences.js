/** @jsx jsx */
import { jsx } from "theme-ui";
import "./Preferences.css";
import { useState, useEffect } from "react";

const defaultproperties = {
            minIrrigationIntervalInMinutes: 15,
            irrigationTimeInSeconds: 10,
            capacityBuffer: 50,
            outputSensor: "Local",
            signalPin: 18,
            Nickname: "Name",
            Batterypower: 1,
            ReadingIntervalInMinutes: 5,
        };
  
const Preferences = props => {
  const sensorName = props.sensorInFocus;
  const [preferences, setPreferences]  = useState(defaultproperties);
  const [databasePreferences, setDatabasePreferences] = useState(defaultproperties);
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
    return preferences === undefined || preferences[key] === databasePreferences[key] ? "#161A30 !important" : "var(--primary) !important"
  }

  const preferenceButtonColor = () => {
    let changed = false;
    for (const key in preferences) {
             not(preferences[key] !== databasePreferences[key]) ? changed = true : null
            }             
    return changed ? "var(--primary) !important" : "#161A30 !important"
  }
  
  const getpref = (key) => {
    return preferences === undefined  ? "" : preferences[key]
  }
  
  var outputname = "";
  var outputsens = props.sensors.find(obj => {return obj.sensorName === preferences.outputSensor});
  if (outputsens === undefined) {outputname = "Local"} else {outputname = outputsens.Nickname}
  const batterypref = () => {return preferences === undefined || preferences.Batterypower === 1 ? "Battery" : "Plug-in"}

  return (
    <h3 sx={{ color: "text" }}>
     <div className="preference">
        <h3>Sensor Name:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("Nickname") }} type="text"
          onChange={(e) => setPreferences({ ...preferences, Nickname: e.target.value })}
          value={getpref("Nickname")} />
      </div>
      <div className="preference">
        <h3>Irrigation time [s]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("irrigationTimeInSeconds") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, irrigationTimeInSeconds: parseInt(e.target.value) })}
          value={getpref("irrigationTimeInSeconds")} />
      </div>
      <div className="preference">
        <h3>Irrigation time interval [min]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("minIrrigationIntervalInMinutes") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, minIrrigationIntervalInMinutes: parseInt(e.target.value) })}
          value={getpref("minIrrigationIntervalInMinutes")} />
      </div>
      <div className="preference">
        <h3>Minimum soil moisture:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("capacityBuffer") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, capacityBuffer: parseInt(e.target.value) })}
          value={getpref("capacityBuffer")} />
      </div>
      <div className="preference">
        <h3>Output Sensor:</h3>
        <select sx={{ color: "text", borderColor: preferenceBorderColor("outputSensor") }}
          onChange={(e) => setPreferences({ ...preferences, outputSensor: e.target.value })}>
            <option value={getpref("outputSensor")} selected> {outputname} </option>
            <option value="Local"> Local </option>
            {props.sensors.map((sensor) => <option value={sensor.sensorName}> {sensor.Nickname} </option>)}
        </select>
      </div>
      <div className="preference">
        <h3>Output Signal Pin:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("signalPin") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, signalPin: parseInt(e.target.value) })}
          value={getpref("signalPin")} />
      </div>
      <div className="preference">
        <h3>Power Type:</h3>
        <select sx={{ color: "text", borderColor: preferenceBorderColor("Batterypower") }}
          onChange={(e) => setPreferences({ ...preferences, Batterypower: parseInt(e.target.value) })}>
            <option value={getpref("Batterypower")} selected> {batterypref()} </option>
            <option value="0"> Plug-in </option>
            <option value="1"> Battery </option>
        </select>
      </div>
      <div className="preference">
        <h3>Sensor update interval [min]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("ReadingIntervalInMinutes") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, ReadingIntervalInMinutes: parseInt(e.target.value) })}
          value={getpref("ReadingIntervalInMinutes")} />
      </div>      
      <div className="preference">
        <div></div>
        <button sx={{ color: "text", borderColor: preferenceButtonColor() }} onClick={() => updatePreferences()}>Submit</button>
      </div>
    </h3>
  );
};

export default Preferences;
