import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import TuiGrid from 'tui-grid';
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_HOST;
axios.interceptors.request.use(
    function (config) {
      const authToken = window.sessionStorage.getItem('authToken');
      if (authToken != null) {
        config.headers["Authorization"] = "Bearer " + authToken
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
)

TuiGrid.applyTheme('striped', {
  outline: {
    border: 'gray',
    //showVerticalBorder : true
  },
  cell: {
    normal: {
      //border: 'gray',
      showVerticalBorder: true,
      showHorizontalBorder: true
    },
    focused: {
      border: 'red'
    }
  }
});

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
