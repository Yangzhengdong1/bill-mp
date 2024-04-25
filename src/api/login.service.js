import axios from "../utils/axios";
import baseUrl from "./config.js";
import aesCipher from "@/utils/crypto";

export const test = () => {
  let url = baseUrl;
  return axios.get(url);
};

/**
 * @description: 登录
 * @param {*} data {code/iv/encryptedData || username/password}
 * @return {*} 返回 Promise
 */
export const login = (data) => {
  const params = JSON.parse(JSON.stringify(data));
  const { password } = params;
  if (password) {
    // 加密
    params.password = aesCipher.encrypt(password);
  }
  let url = baseUrl + "/account/login";
  return axios.post(url, params);
};

/**
 * @description: 账号绑定
 * @param {*} params {username/password}
 * @return {*} Promise
 */
export const bind = (params) => {
  let { username, password } = params;
  password = aesCipher.encrypt(password);
  let url = baseUrl + "/account/bind";
  return axios.post(url, { username, password });
};
