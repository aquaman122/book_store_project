import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {worker} from './mock/browser';

async function mountApp() {
  if (process.env.NODE_ENV === "development") {
    await worker.start(); // MSW 시작
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // ServiceWorkerRegistration = 
}

mountApp();