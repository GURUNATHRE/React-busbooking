import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom';
import axios from "axios";

// set base URL   
axios.defaults.baseURL = "http://127.0.0.1:8000/list/";

// add token automatically
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
)

//  in sessionstoreage "access" token after that 