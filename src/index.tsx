import './index.css';

import * as serviceWorker from './serviceWorker';

import AppContainer from './components/AppContainer/AppContainer';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// import { whyDidYouUpdate } from 'why-did-you-update';

// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouUpdate(React);
// }

// axios.defaults.baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
// axios.defaults.headers.common.Authorization = 'AUTH TOKEN';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.defaults.withCredentials = true;

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
  <HashRouter>
    <AppContainer />
  </HashRouter>
);

ReactDOM.render(
  devApp,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
