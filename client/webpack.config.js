const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge')
  // 分离HTML文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用于剥离css的
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//webpack插件，用于清除目录文件
const CleanPlugin = require('clean-webpack-plugin')
  // 压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');



var dev = {
  entry: './src/main.js',
  output: {
    // 输出到根目录
    // path: path.resolve(__dirname, 'webapp/js/main/'),
    path: path.resolve(__dirname, 'webapp/'),

    // 我不需要公共文件目录
    // publicPath: '/dist/',

    // js的输出目录
    filename: 'js/main/[name].js'
  },
  module: {
    rules: [
      // vue
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // ------------------------------------
      // css
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      // less
      {
        test: /\.less$/,
        loader: 'less-loader'
      },
      // fonts
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          // 一样这个。
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      // img
      {
        // test: /\.(png|jpg|gif|svg)$/,
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          // 一样这个。
          name: 'imgs/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  resolve: {},
  devServer: {
    port: 1234,
    contentBase: "./webapp",
    historyApiFallback: true,
    hot: true, // 配置HMR之后可以选择开启
    noInfo: true,
    inline: true // 实时刷新
  },
  devtool: '#eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      // 模板文件也要改
      template: './webapp/index_dev.html' // 模版文件
    }),
    new webpack.HotModuleReplacementPlugin() // 热加载插件
  ]
};

var build = {
  entry: './src/main.js',
  output: {
    // 输出到根目录
    // path: path.resolve(__dirname, 'webapp/js/main/'),
    path: path.resolve(__dirname, 'webapp/'),

    // 我不需要公共文件目录
    // publicPath: '/dist/',

    // js的输出目录
    filename: 'js/main/[name].js'
  },
  module: {
    rules: [
      // vue
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          // vue-loader options go here
        }
      },
      // js
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // ------------------------------------
      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      // less
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
      // ------------------------------------
      // fonts
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          // 一样这个。
          name: 'fonts/[name].[hash:7].[ext]'
        }
      },
      // img
      {
        // test: /\.(png|jpg|gif|svg)$/,
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          // 一样这个。
          name: 'imgs/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    // ------------------------------------模板入口
    new HtmlWebpackPlugin({
      // 模版文件
      template: './webapp/index_dev.html',
      filename: 'index.html'
    }),
    // -------------------------------------css--生成的地方
    new ExtractTextPlugin('css/main/[name].[contenthash].css'),

    // -------------------------------------清除
    // 清除js
    new CleanPlugin(['main'], {
      root: path.resolve(__dirname, 'webapp/js'),
      verbose: true,
      dry: false,
      exclude: ['common', 'lib', 'API.js']
    }),
    // 清除css
    new CleanPlugin(['main'], {
      root: path.resolve(__dirname, 'webapp/css'),
      verbose: true,
      dry: false,
      exclude: ['css-loader-master']
    }),
    // 清除fonts
    new CleanPlugin(["fonts"], {
      root: path.resolve(__dirname, 'webapp'),
      verbose: true,
      dry: false,
      // exclude: ['css-loader-master']
    }),

    
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors' // 将公共模块提取，生成名为`vendors`的chunk
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // new CompressionWebpackPlugin({
    //   asset: "[path].gz[query]",
    //   algorithm: "gzip",
    //   test: /\.(js|css)$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ]
};

// production
if (process.env.NODE_ENV === 'production') {
  module.exports = build;
}
// dev
else {
  module.exports = dev;
}
