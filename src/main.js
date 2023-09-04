import Vue from "vue";
import App from "./App";
import "./uni.promisify.adaptor";
import axios from "axios";
import uView from 'uview-ui';
import Loading from './components/loading.vue';
require('./utils/axios');
Vue.use(uView);
Vue.prototype.$http = axios;
Vue.component('loading', Loading);
Vue.config.productionTip = false;

App.mpType = "app";

export const app = new Vue({
  ...App,
});
app.$mount();
// #ifdef H5
document.title = document.title ? document.title : 'bill-mp';
// #endif
