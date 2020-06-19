/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";
import { useState, useEffect } from "react";

const Preferences = props => {
  const sensorName = props.sensorInFocus
  const capacityFactor = 100000
  const [preferences, setPreferences] = useState({
    minIrrigationIntervalInMinutes: 0,
    irrigationTimeInSeconds: 0,
    capacityBuffer: 0,
    signalPin: 0
  });
  const [databasePreferences, setDatabasePreferences] = useState({
    minIrrigationIntervalInMinutes: 0,
    irrigationTimeInSeconds: 0,
    capacityBuffer: 0,
    signalPin: 0
  });

  useEffect(() => {
    if (sensorName) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/preferences/${sensorName}`)
        .then(res => res.json())
        .then(
          async (preferences) => {
            setDatabasePreferences({ ...preferences, capacityBuffer: parseInt(capacityFactor / preferences.capacityBuffer) })
            setPreferences({ ...preferences, capacityBuffer: parseInt(capacityFactor / preferences.capacityBuffer) })
          },
          (error) => {
            console.log(`Coudn't fetch data. Error: ${error}`)
          }
        )
    }
  }, [setPreferences, sensorName])


  const updatePreferences = (e, key) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/preferences/${sensorName}`, {
      headers: { 'Content-Type': 'application/json', },
      method: 'PUT',
      body: JSON.stringify({ ...preferences, capacityBuffer: parseInt(capacityFactor / preferences.capacityBuffer) })
    })
      .then(res => res.json())
      .then(
        async (preferences) => {
          setDatabasePreferences({ ...preferences, capacityBuffer: parseInt(capacityFactor / preferences.capacityBuffer) })
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
      signalPin: preferences.signalPin
    }) === JSON.stringify({
      minIrrigationIntervalInMinutes: databasePreferences.minIrrigationIntervalInMinutes,
      irrigationTimeInSeconds: databasePreferences.irrigationTimeInSeconds,
      capacityBuffer: databasePreferences.capacityBuffer,
      signalPin: databasePreferences.signalPin
    }) ? "#161A30 !important" : "var(--primary) !important"
  }

  return (
    <h3 sx={{ color: "text" }}>
      <div className="preference">
        <h3>Irrigation time [s]:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("irrigationTimeInSeconds") }} type="number"
          onChange={
            (e) => setPreferences({ ...preferences, irrigationTimeInSeconds: parseInt(e.target.value) })
          }
          value={preferences.irrigationTimeInSeconds} />
      </div>
      <div className="preference">
        <h3>Minimum irrigation time interval [min]:</h3>
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
        <h3>Signal Pin:</h3>
        <input sx={{ color: "text", borderColor: preferenceBorderColor("signalPin") }} type="number"
          onChange={(e) => setPreferences({ ...preferences, signalPin: parseInt(e.target.value) })}
          value={preferences.signalPin} />
      </div>
      <div className="preference">
        <div></div>
        <button sx={{ color: "text", borderColor: preferenceButtonColor() }} onClick={() => updatePreferences()}>Submit</button>
      </div>
    </h3>
  );
};

export default Preferences;
