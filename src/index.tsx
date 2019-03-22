import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './index.css';
import App from './components/App/App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, HashRouter } from 'react-router-dom';

axios.defaults.headers.common.Authorization = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (req) => {
    console.log(`[Request Success]`);
    console.log(req);
    return req;
  },
  (err) => {
    console.log(`[Request Error]`);
    console.log(err);
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  (res) => {
    console.log(`[Response Success]`);
    console.log(res);
    return res;
  },
  (err) => {
    console.log(`[Response Error]`);
    console.log(err);
    return Promise.reject(err);
  }
);

const devApp = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

const prodApp = (
  <HashRouter>
    <App />
  </HashRouter>
);

ReactDOM.render(
  process.env.NODE_ENV === 'production' ? prodApp : devApp,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
