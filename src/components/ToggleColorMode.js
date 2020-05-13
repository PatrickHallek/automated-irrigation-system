/** @jsx jsx */
import { jsx } from "theme-ui";
import { useColorMode } from "theme-ui";

const ToggleColorMode = () => {
  const [colorMode, setColorMode] = useColorMode();
  return (
    <button
      className="toggler"
      onClick={() => setColorMode(colorMode === "light" ? "dark" : "light")}
    >
      <div sx={{ color: "text" }}>
        {colorMode === "light" ?
          <img width="20px" src={require('../assets/moon.svg')} alt="dark" /> :
          <img width="20px" src={require('../assets/sun.svg')} alt="light" />
        }
      </div>
    </button>
  );
};

export default ToggleColorMode;
