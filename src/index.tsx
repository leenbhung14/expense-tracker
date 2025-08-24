import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RootStore } from './stores/RootStore';

const rootStore = new RootStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App rootStore={rootStore} />
  </React.StrictMode>
);