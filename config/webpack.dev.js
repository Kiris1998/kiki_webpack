const path = require('path') //文件路劲处理
const uglify = require('uglifyjs-webpack-plugin') //压缩文件
const html = require('html-webpack-plugin') //处理html文件
const extractTextPlugin = require('extract-text-webpack-plugin')  //将css单独输出

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js' //定义入口文件
  },
  output: {
    path: path.resolve(__dirname,'../dist'),  //定义输出路径
    filename: '[name].js'
    // publicPath: website.publicPath
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(png|jpg|gif|jpeg)/,
        use :[
          {
            loader: "url-loader",
            options: {
              limit: 500,     //如果文件大于500kb时，使用file-loader来压缩图片使其成为base
              publicPath: 'http://localhost:8888/images', //为了使图片在输出以后可以以正确的路径被找到
              outputPath: 'images/'
            }
          }
        ]
      },
      {
        test: /\.(html|htm)$/i,
        use: ['html-withimg-loader']    //正确处理html当中的图片路劲
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new uglify(),
    new html({
      minify: {
        removeAttributeQuotes: true
      },
      hash: true,
      template: './src/index.html'
    }),
    new extractTextPlugin("css/index.css")
  ],
  devServer: {  //基本的开发设置
    contentBase: path.resolve(__dirname,'../dist'),
    host: 'localhost',
    compress: true,
    port: 8888
  }
}