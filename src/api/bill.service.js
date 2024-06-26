import baseUrl from "./config";
import axios from "../utils/axios";

export const test = () => {
	const url = baseUrl + "/test";
	return axios.get(url);
};

/**
 * @description: 获取账单列表
 * @param {*} params {pageSize/pageNum}
 * @return {*} 返回 Promise
 */
export const getBillList = params => {
	const url = baseUrl + "/bill/list";
	return axios.get(url, { params });
};

/**
 * @description: 新增一条账单
 * @param {*} params {payType/billType/amount/remark}
 * @return {*} 返回 Promise
 */
export const addBill = params => {
	let url = baseUrl + "/bill/create";
	return axios.post(url, params);
};

export const getBillDetail = id => {
	let url = baseUrl + `/bill/detail?id=${id}`;
	return axios.get(url);
};

export const deleteBill = id => {
	let url = baseUrl + `/bill/remove/${id}`;
	return axios.delete(url);
};

export const updateBill = params => {
  let url = baseUrl + "/bill/update";
  return axios.post(url, params);
};

