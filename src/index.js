import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query"
import { Provider } from "react-redux"
import store from "./Redux/Store/store";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios';



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
})



// if (process.env.NODE_ENV === 'development') {
axios.defaults.baseURL = "https://devorganaise.com/api/";
//"http://localhost:3010/api"
// } else if (process.env.NODE_ENV === 'production') {
//   axios.defaults.baseURL = process.env.REACT_APP_API_ENDPOINT;
// }

///// add  intercepter 
axios.interceptors.request.use(
  function (config) {
    if ("token" in localStorage) {
      config.headers["auth-token"] = `Bearer ${localStorage.getItem("token")}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer autoClose={2000} />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)
