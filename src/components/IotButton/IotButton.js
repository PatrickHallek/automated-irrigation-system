/** @jsx jsx */
import { jsx } from "theme-ui";
import "./IotButton.css";
import { useState } from "react";

const IotButton = props => {
  const sensorName = props.sensorInFocus
  const [spinner, addSpinner] = useState(false);

  const sendIrrigationRequest = () => {
    addSpinner(true)
    fetch(document.URL.replace(":5000", ":3000")+`irrigate/${sensorName}`)
      .then(res => res.json())
      .then(
        async (result) => {
          addSpinner(false)
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  const deletesensordata = () => {
    fetch(document.URL.replace(":5000", ":3000")+`sensors/deletedata/${sensorName}`)
      .then(res => res.json())
      .then(
        async (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  const deletesensor = () => {
    fetch(document.URL.replace(":5000", ":3000")+`sensors/deletesensor/${sensorName}`)
      .then(res => res.json())
      .then(
        async (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }
  
  return (
    <div className="iot-button">
      <button
        sx={{
          background:
            spinner === false
              ? "linear-gradient(90deg, #598bff, #3366FF)"
              : "grey"
        }}
        onClick={() => sendIrrigationRequest()}
      >
        {spinner === false ? <img width="40px" src={require('../../assets/watering.svg')} alt="dark" /> : <div id="loading" />}
      </button>
      <h3 sx={{ color: "text", marginLeft: "12px", lineHeight: "23px" }}>
        Start Manual Irrigation <br />
        {spinner === false ? "OFF" : "ON"}
      </h3>
      <button sx={{background:"linear-gradient(90deg, #598bff, #3366FF)"}}
        onClick={() => deletesensordata()}
      >
        <img width="40px" src={require('../../assets/watering.svg')} alt="dark" />
      </button>
      <h3 sx={{ color: "text", marginLeft: "12px", lineHeight: "23px" }}>
        Delete Sensor Data <br />
      </h3>
      <button sx={{background:"linear-gradient(90deg, #598bff, #3366FF)"}}
        onClick={() => deletesensor()}
      >
        <img width="40px" src={require('../../assets/watering.svg')} alt="dark" />
      </button>
      <h3 sx={{ color: "text", marginLeft: "12px", lineHeight: "23px" }}>
        Delete Sensor <br />
      </h3>
    </div>
  );
};

export default IotButton;
