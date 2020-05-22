/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";
import { useState, useEffect } from "react";

const Preferences = () => {
  const [preferences, setPreferences] = useState({
    minIrrigationIntervalInMinutes: 0,
    irrigationTimeInSeconds: 0,
    capacityBuffer: 0
  });

  useEffect(() => {
    getPreferences()
  }, [setPreferences])

  const getPreferences = () => {
    fetch(process.env.REACT_APP_BACKEND_URL + "/preferences")
      .then(res => res.json())
      .then(
        async (preferences) => {
          setPreferences(preferences)
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  const updatePreferences = (e, key) => {
    setPreferences({ ...preferences, [key]: Number(e.target.value) })
    fetch(process.env.REACT_APP_BACKEND_URL + "/preferences", {
      headers: { 'Content-Type': 'application/json', },
      method: 'PUT',
      body: JSON.stringify({ ...preferences })
    })
      .then(res => res.json())
      .then(
        async (result) => {
          setPreferences(result)
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  return (
    <h3 sx={{ color: "text" }}>
      <div className="preference">
        <h3>Irrigation time [s]:</h3>
        <input sx={{ color: "text" }} type="number"
          onChange={(e) => updatePreferences(e, "irrigationTimeInSeconds")}
          value={preferences.irrigationTimeInSeconds} />
      </div>
      <div className="preference">
        <h3>Minimum irrigation time interval [min]:</h3>
        <input sx={{ color: "text" }} type="number"
          onChange={(e) => updatePreferences(e, "minIrrigationIntervalInMinutese")}
          value={preferences.minIrrigationIntervalInMinutes} />
      </div>
      <div className="preference">
        <h3>Capacity Buffer:</h3>
        <input sx={{ color: "text" }} type="number"
          onChange={(e) => updatePreferences(e, "capacityBuffer")}
          value={preferences.capacityBuffer} />
      </div>
    </h3>
  );
};

export default Preferences;
