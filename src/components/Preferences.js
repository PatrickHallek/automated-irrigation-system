/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui";
import "../style.css";
import { useState, useEffect } from "react";

const Preferences = props => {
  const sensorName = props.sensorInFocus
  const context = useThemeUI()
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
    fetch(`${process.env.REACT_APP_BACKEND_URL}/preferences/${sensorName}`)
      .then(res => res.json())
      .then(
        async (preferences) => {
          setDatabasePreferences(preferences)
          setPreferences(preferences)
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }, [setPreferences, sensorName])


  const updatePreferences = (e, key) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/preferences/${sensorName}`, {
      headers: { 'Content-Type': 'application/json', },
      method: 'PUT',
      body: JSON.stringify({ ...preferences })
    })
      .then(res => res.json())
      .then(
        async (result) => {
          setDatabasePreferences(result)
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  const preferenceBorderColor = (key) => {
    return preferences[key] === databasePreferences[key] ? `${context.theme.colors.background} !important` : "initial"
  }

  const preferenceButtonColor = () => {
    return JSON.stringify(preferences) === JSON.stringify(databasePreferences) ? `${context.theme.colors.background} !important` : "initial"
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
        <h3>Capacity Buffer:</h3>
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
        <button sx={{ borderColor: preferenceButtonColor() }} onClick={() => updatePreferences()}>Submit</button>
      </div>
    </h3>
  );
};

export default Preferences;
