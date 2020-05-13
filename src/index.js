import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider, ColorMode } from "theme-ui";
import theme from "./theme";
import Main from "./Main";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ColorMode />
      <Main />
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
