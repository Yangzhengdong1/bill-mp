import axios from '../utils/axios';
import baseUrl from './config.js';
import jsencrypt from '../utils/jsencrypt';


export const test = () => {
  let url = baseUrl;
  return axios.get(url);
};

/**
 * @description: 登录
 * @param {*} param {code/iv/encryptedData || username/password}
 * @return {*} 返回 Promise
 */
export const login = (param) => {
  const params = JSON.parse(JSON.stringify(param));
  const { password } = params;
  if (!password) {
    // 加密
    params.password = jsencrypt.encryptedData(password);
  }
  let url = baseUrl + '/account/login';
  return axios.post(url, params);
};
