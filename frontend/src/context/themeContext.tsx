import React, { ReactNode, createContext, useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../style/global";
import { getTheme, ThemeName } from "../style/theme";

const DEFAULT_THEME_NAME = "dark";
const THEME_LOCALSTORAGE_KEY = "book_store_theme";

interface State {
  themeName: ThemeName;
  toggleTheme: () => void;
}

export const initialState: State = {
  themeName: DEFAULT_THEME_NAME as ThemeName,
  toggleTheme: () => {console.log(1)},
}

export const ThemeContext = createContext<State>(initialState);

export const BookStoreThemeProvider = ({children} : { children: ReactNode }) => {
  const [themeName, setThemeName] = useState<ThemeName>(DEFAULT_THEME_NAME);

  useEffect(() => {
    // localStorage에 저장
    const savedThemeName = localStorage.getItem(THEME_LOCALSTORAGE_KEY) as ThemeName;
    setThemeName(savedThemeName ||  DEFAULT_THEME_NAME);
  }, []);

  const toggleTheme = () => {
    setThemeName((prevThemeName) => {
      const newThemeName =  prevThemeName  === "light" ? "dark" : "light";
      localStorage.setItem(THEME_LOCALSTORAGE_KEY, newThemeName);
      return newThemeName;
    });
  };

  const value = {
    themeName,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={getTheme(themeName)}>
        <GlobalStyle themeName={themeName} />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

