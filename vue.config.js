const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
// let cesiumSource = './node_modules/cesium/Source'
// let cesiumWorkers = '../Build/Cesium/Workers'

const cesiumBuild = './node_modules/cesium/Build/Cesium';
const threeBuild = './node_modules/three/Build';

module.exports = {
  publicPath: '',
  pages: {
    index: {
      entry: 'src/main.js',
    }
  },
  configureWebpack: {
    output: {
      sourcePrefix: ' '
    },
    amd: {
      toUrlUndefined: true
    },
    // resolve: {
    //   // 设置别名
    //   alias: {
    //     'cesium': path.resolve(__dirname, cesiumSource)
    //   }
    // },
    plugins: [
      new CopyWebpackPlugin([{from: path.join(__dirname, cesiumBuild), to: 'Cesium'}]),
      new CopyWebpackPlugin([{from: path.join(__dirname, threeBuild), to: 'Three'}]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
      // new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
      // new webpack.DefinePlugin({
      //   CESIUM_BASE_URL: JSON.stringify('./')
      // })
    ],
  },
  devServer: {
    proxy: {
      '/areas': {
        target: 'https://geo.datav.aliyun.com/areas',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/areas': ''
        }
      },
    }
  }
}