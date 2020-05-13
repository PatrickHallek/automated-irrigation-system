/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";
import { useState } from "react";

const IotButton = () => {
  const [spinner, addSpinner] = useState(false);

  const loading = () => {
    addSpinner(true);
    setTimeout(() => {
      addSpinner(false);
    }, 2000);
  };

  return (
    <div className="iot-button">
      <button
        sx={{
          background:
            spinner === false
              ? "linear-gradient(90deg, #598bff, #3366FF)"
              : "grey"
        }}
        onClick={() => loading()}
      >
        {spinner === false ? <img width="40px" src={require('../assets/watering.svg')} alt="dark" /> : <div id="loading" />}
      </button>
      <h2 sx={{ color: "text", marginLeft: "12px", lineHeight: "23px" }}>
        Start Manual Irrigation <br />
        {spinner === false ? "OFF" : "ON"}
      </h2>
    </div>
  );
};

export default IotButton;
