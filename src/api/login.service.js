import axios from '../utils/axios';
import baseUrl from './config.js';

export const test = () => {
  let url = baseUrl;
  return axios.get(url);
};

/**
 * @description: 登录
 * @param {*} params {code/iv/encryptedData}
 * @return {*} 返回 Promise
 */
export const login = (params) => {
  let url = baseUrl + '/account/login';
  return axios.post(url, params);
};
