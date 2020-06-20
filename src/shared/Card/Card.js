/** @jsx jsx */
import { jsx } from "theme-ui";
import "./Card.css";

const Card = props => {
  return (
    <div sx={{ bg: "backgroundSecondary" }} className="card">
      {props.title ? (
        <div>
          <h2>
            {props.title}
            <div className="separator" />
          </h2>

        </div>
      ) : (
          <div />
        )}
      {props.body}
    </div>
  );
};

export default Card;
