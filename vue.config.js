const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // devServer: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://192.168.101.200', //对应自己的接口
  //       changeOrigin: true,
  //       ws: false,
  //     },
  //   }
  // },
})
