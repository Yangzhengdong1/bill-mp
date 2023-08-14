let baseUrl;
// #ifdef H5
baseUrl = '/httpProxy';
// #endif
// #ifdef MP-WEIXIN
if (process.env.NODE_ENV === 'development') {
  console.log('开发环境');
  baseUrl = 'http://192.168.18.170:8889';
} else {
  baseUrl = 'http://111.229.233.21:8083';
  console.log('生产环境');
}
// #endif

export default baseUrl;
