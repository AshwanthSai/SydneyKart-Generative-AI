import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

/* For Providing Global Context */
import { Provider } from 'react-redux';
/* Our Redux Store */
import store from "./store/store"


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <Provider store = {store}>
        <App />
      </Provider>
  </React.StrictMode>
);

