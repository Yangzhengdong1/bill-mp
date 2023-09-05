import Vue from 'vue';
import axios from 'axios';
import uView from 'uview-ui';

import './uni.promisify.adaptor';
require('./utils/axios');


import App from './App';
import Loading from '@/components/loading.vue';
import Tabbar from '@/components/tabbar.vue';
Vue.use(uView);
Vue.prototype.$http = axios;
Vue.component('loading', Loading);
Vue.component('tabbar', Tabbar);
Vue.config.productionTip = false;

App.mpType = 'app';

export const app = new Vue({
  ...App
});
app.$mount();
// #ifdef H5
document.title = document.title ? document.title : 'bill-mp';
// #endif
