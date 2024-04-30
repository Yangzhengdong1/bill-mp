import axios from 'axios';
import adapter from 'axios-miniprogram-adapter';
import { app } from '../main.js';


const getLocalToken = () => {
  const token = uni.getStorageSync('user_message').token;
  return token ? token : false;
};
const service = axios.create({
	// #ifdef MP-WEIXIN
	adapter: adapter
	// #endif
});

// 请求拦截
service.interceptors.request.use(config => {
  let Authorization;
  if (getLocalToken()) {
    Authorization = 'Bearer ' + getLocalToken();
  } else {
    // Authorization = 'Bearer ' + uni.getStorageSync('user_message').token;
  }
  config.headers.Authorization = Authorization;
  // console.log('请求拦截', config);
  return config;
}, error => {
  console.log('请求错误拦截', error);
});


// 响应拦截
service.interceptors.response.use(response => {
    // console.log('响应拦截', response.status);
    delete response.headers;
    delete response.config;
    delete response.request;
    delete response.statusText;
    return response.data;
}, error => {
  console.log('响应错误拦截', error.response);
  if (!error.response) {
    app.$toast('接口报错咯');
    return;
  }
  const { response } = error;
  if (response) {
    const message = response.data.message ? response.data.message : '接口出错';
    app.$toast(message);
    if (response.status === 403) {
      uni.clearStorageSync('user_message');
      uni.redirectTo({url: '/pages/login/login'});
    }
  }
  return Promise.reject(error);
});

export default service;
