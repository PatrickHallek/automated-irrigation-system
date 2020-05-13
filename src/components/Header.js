/** @jsx jsx */
import { jsx } from "theme-ui";
import "../style.css";
import ToggleColorMode from "./ToggleColorMode";

const Header = () => {
  return (
    <header sx={{ bg: "backgroundSecondary" }}>
      <h1 className="logo-text" sx={{ color: "text" }}>
        <img src={require('../assets/logo.svg')} alt="logo" />
        smart irrigation
      </h1>
      <ToggleColorMode />
    </header>
  );
};

export default Header;
