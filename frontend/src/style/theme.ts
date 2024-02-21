export type ThemeName = "light" | "dark";
type ColorKey = "primary" | "background" | "secondary" | "third";

interface Theme {
  name : ThemeName;
  color: Record<ColorKey, string>;
}

export const light = {
  name: 'light',
  color : {
    primary: "brown",
    background: "lightgray",
    secondary: "blue",
    third : "green",
  },
};

export const dark = {
  name: "dark",
  color : {
    primary: "coral",
    background: "midnightblue",
    secondary: "darkblue",
    third : "darkgreen",
  }
}