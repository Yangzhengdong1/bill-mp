let baseUrl;
// #ifdef H5
baseUrl = '/httpProxy';
// #endif
// #ifdef MP-WEIXIN
if (process.env.NODE_ENV === 'development') {
  console.log('开发环境', process.env.VUE_APP_DEV_BASE_URL);
  baseUrl = process.env.VUE_APP_DEV_BASE_URL;
} else {
  baseUrl = process.env.VUE_APP_PROD_BASE_URL;
  console.log('生产环境');
}
// #endif

export default baseUrl;
