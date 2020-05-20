/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";
import { useState } from "react";

const IotButton = () => {
  const [spinner, addSpinner] = useState(false);

  const sendIrrigationRequest = () => {
    addSpinner(true)
    fetch(process.env.REACT_APP_BACKEND_URL + "/sensors/irrigation")
      .then(res => res.json())
      .then(
        async (result) => {
          console.log(result)
          addSpinner(false)
        },
        (error) => {
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
        {spinner === false ? <img width="40px" src={require('../assets/watering.svg')} alt="dark" /> : <div id="loading" />}
      </button>
      <h3 sx={{ color: "text", marginLeft: "12px", lineHeight: "23px" }}>
        Start Manual Irrigation <br />
        {spinner === false ? "OFF" : "ON"}
      </h3>
    </div>
  );
};

export default IotButton;
