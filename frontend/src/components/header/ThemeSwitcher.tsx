import React, { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";

function ThemeSwitcher() {
  const { themeName, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} style={{color: "black"}}>{themeName}</button>
  );
}

export default ThemeSwitcher;