module.exports = {
  transpileDependencies: ['uview-ui'],
  devServer: {
    client: {
      overlay: {
        //有报错发生，直接覆盖浏览器视窗，显示错误
        errors: false,
        warnings: false
      }
    },
    proxy: {
      '/httpProxy': {
        target: 'http://192.168.18.170:8889', // 开发环境后台接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/httpProxy': ''
        }
      }
    }
  }
};
