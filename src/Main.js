/** @jsx jsx */
import { jsx } from "theme-ui";
import Header from "./components/Header";
import Card from "./components/Card";
import IotButton from "./components/IotButton";
import LineChart from "./components/LineChart";
import Preferences from "./components/Preferences";
import SensorPicker from "./components/SensorPicker";
import { useState, useEffect } from "react";

const Main = () => {
  const [sensors, setSensors] = useState([]);
  const [sensorInFocus, setSensorInFocus] = useState();
  useEffect(() => {
    getSensors()
  }, [setSensors])

  const getSensors = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/sensors`)
      .then(res => res.json())
      .then(
        async (sensors) => {
          setSensors(sensors)
          setSensorInFocus(sensors[0])
        },
        (error) => {
          console.log(`Coudn't fetch data. Error: ${error}`)
        }
      )
  }

  return (
    <div>
      <Header />
      <div className="main">
        <div className="container">
          <SensorPicker sensors={sensors} setSensorInFocus={setSensorInFocus} sensorInFocus={sensorInFocus} />
          <Card title="Statistics" body={<LineChart sensorInFocus={sensorInFocus} />} />
          <Card title="Preferences" body={<Preferences sensorInFocus={sensorInFocus} />} />
          <Card body={<IotButton />} />
        </div>
      </div>
    </div>
  );
};

export default Main;
