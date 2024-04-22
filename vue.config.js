const path = require("path");

const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
  transpileDependencies: ['uview-ui'],
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src")
      }
    },
    stats: {
      warnings: false,
      assets: false,
      chunks: false,
      modules: false,
    }
  },
  devServer: {
    client: {
      overlay: false
      // overlay: {
      //   //有报错发生，直接覆盖浏览器视窗，显示错误
      //   errors: false,
      //   warnings: false
      // }
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
