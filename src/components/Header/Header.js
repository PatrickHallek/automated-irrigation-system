/** @jsx jsx */
import { jsx } from "theme-ui";
import "./Header.css";
import ThemePicker from "./ThemePicker/ThemePicker";

const Header = () => {
  return (
    <header sx={{ bg: "backgroundSecondary" }}>
      <h1 className="logo-text" sx={{ color: "text" }}>
        <img src={require('../../assets/logo.svg')} alt="logo" />
        smart irrigation
      </h1>
      <ThemePicker />
    </header>
  );
};

export default Header;
