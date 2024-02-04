/** @jsx jsx */
import { jsx } from "theme-ui";
import "./SensorPicker.css";

const SensorPicker = props => {
    return (
        <div className="sensorPicker " sx={{ display: props.sensors.length > 1 ? "flex" : "none"}}>
            {props.sensors.map((sensor) => <div key={sensor.sensorName} onClick={() => props.setSensorInFocus(sensor.sensorName)}
                sx={{ bg: sensor.sensorName === props.sensorInFocus ? "var( --primary) !important" : "backgroundSecondary" }}
            className="card"><h4>{sensor.Nickname}</h4></div>)}
        </div>
    );
};

export default SensorPicker;
