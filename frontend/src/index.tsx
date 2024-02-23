import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeContext, initialState } from "./context/themeContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeContext.Provider value={initialState}>
      <App />
    </ThemeContext.Provider>
  </React.StrictMode>
);
