import axios from 'axios';
import Fingerprint2 from 'fingerprintjs2';
import router from './router';
import store from '@/store/store';
import { Message } from 'element-ui';


let Finger = '';
if (window.localStorage.Finger) {
  [Finger] = window.localStorage.Finger;
} else {
  Fingerprint2.get((components) => {
    Finger = Fingerprint2.x64hash128(components.map(pair => pair.value).join(), 31);
    window.localStorage.setItem('Finger', Finger);
  });
}

/* eslint no-param-reassign: "error" */

// http request 拦截器
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

let request = 0;
let errorDisplay = false;

axios.interceptors.request.use(
  async (config) => {
    if (window.localStorage.JWT_TOKEN) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `Bearer ${window.localStorage.JWT_TOKEN}`;
    }
    if (window.localStorage.Finger) {
      // 判断是否存在Finger，如果存在的话，则每个http header都加上Finger
      config.headers.Finger = window.localStorage.Finger;
    }
    request += 1;
    if (request > 0) {
      store.commit('index/setLoading', true);
    }
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  },
);

// http response 拦截器
axios.interceptors.response.use(
  async (response) => {
    if (response.headers['jwt-token']) {
      window.localStorage.setItem('JWT_TOKEN', response.headers['jwt-token']);
    }
    request -= 1;
    if (request <= 0) {
      store.commit('index/setLoading', false);
      request = 0;
    }
    return response;
  },
  (err) => {
    if (err.response.status === 401) {
      request = 0;
      if (window.navigator.userAgent.indexOf('Android') > 0) {
        try {
          window.android.token_expired();
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          window.webkit.messageHandlers.token_expired.postMessage('token_expired');
        } catch (error) {
          console.log(error);
        }
      }
      if (!errorDisplay) {
        errorDisplay = true;
        Message({ message: err.response.data.message, type: 'error' });
        setTimeout(() => {
          errorDisplay = false;
        }, 3000);
      }
      window.localStorage.removeItem('JWT_TOKEN');
      store.commit('index/setCardOpen', false);
      router.push({ path: '/' });
    } else {
      request -= 1;
    }
    if (request <= 0) {
      store.commit('index/setLoading', false);
      request = 0;
    }
    return Promise.reject(err);
  },
);

export default axios;
