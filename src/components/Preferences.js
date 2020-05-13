/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";

const Preferences = () => {

  return (
    <h3 sx={{ color: "text" }}>
      <div className="preference">
        <h3>Irrigation time:</h3>
        <input sx={{ color: "text" }} type="number" defaultValue="23" />
      </div>
      <div className="preference">
        <h3>Capacity Buffer:</h3>
        <input sx={{ color: "text" }} type="number" defaultValue="13" />
      </div>
      <div className="preference">
        <h3>Minimum irrigation time interval:</h3>
        <input sx={{ color: "text" }} type="number" defaultValue="32" />
      </div>
    </h3>
  );
};

export default Preferences;
