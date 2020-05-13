/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";

const Card = props => {
  return (
    <div sx={{ bg: "backgroundSecondary" }} className="card">
      {props.title ? (
        <div>
          <h2>{props.title}</h2>
          <div className="separator" />
        </div>
      ) : (
        <div />
      )}
      {props.body}
    </div>
  );
};

export default Card;
