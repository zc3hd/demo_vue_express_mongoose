// 要测试那个模块
var one = './src/';



// 配置项
var opts = {
  // 目标文件夹
  src: one,

  // 目标文件夹
  dist: "webapp",
  img: 'img',
  font: 'fonts',
};

var conf_local = require('./conf.js');
opts.port = conf_local.dev_port;




var one_arr = one.split('/');
var server_base = [];
server_base.push(one_arr[0]);
server_base.push(one_arr[1]);

// 找到dev下的根目录
var dev_base_str = server_base.join('/');
// 找到build下的根目录
var build_base_str = one.replace(one_arr[1], opts.dist);


// console.log(process.env.NODE_ENV);


// *********************************************依赖的包
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// 指定入口HTML
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 用于剥离css的
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//webpack插件，用于清除目录文件
const CleanPlugin = require('clean-webpack-plugin');
// 压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const opn = require('opn');
// *********************************************依赖的包

var rules = [
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

  // fonts
  {
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'url-loader',
    query: {
      limit: 10000,
      // 一样这个。
      name: `${opts.font}/[name].[hash:7].[ext]`
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
      name: `${opts.img}/[name].[hash:7].[ext]`
    }
  },
  // hdr
  {
    // test: /\.(png|jpg|gif|svg)$/,
    test: /\.hdr$/,
    loader: 'url-loader',
    query: {
      // limit: 10000,
      // 一样这个。
      name: `${opts.img}/[name].[hash:7].[ext]`
    }
  }
];
var new_rules = null;
// dev模式
if (process.env.NODE_ENV == 'dev') {
  var dev_css = [
    // 
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },
    //
    {
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader'
    },
  ];
  new_rules = rules.concat(dev_css);
  // dev的配置项
  const conf = {
    devtool: 'eval-source-map',
    //入口及webapp-dev-server
    entry: [`webpack-dev-server/client?http://localhost:${opts.port}/`, `${opts.src}index.js`],
    plugins: [
      // 模版文件
      new HtmlWebpackPlugin({
        // 模板文件也要改
        template: `${opts.src}index.html`,
      }),
    ],
    // 使用loader模块
    module: {
      rules: new_rules
    },
    // 只对命令行模式管用
    // devServer: {
    //   // 本地服务器所加载的页面所在的目录后，需要手动打出8080/index.html路径
    //   contentBase: "./webapp",
    //   hot: true, // 配置HMR之后可以选择开启
    //   historyApiFallback: true, // 不跳转
    //   inline: true // 实时刷新
    // },
  };
  const compiler = webpack(conf);
  const server = new WebpackDevServer(compiler, {
    open: true,
    // 提供服务的路径--./路径
    contentBase: dev_base_str,
    noInfo: false,

    // 热加载模式开启，就是页面html的显示部分改了，不会刷新，注释之后--改代码就会刷。
    // hot: true,

    // 路由的历史模式不转跳
    historyApiFallback: false,

    // 启动压缩
    compress: true,
    // 设置本地服务器
    setup: function(app) {
      // 这个APP就是express生成的app
      // require('./api_server/app.js')(app);
    },

    // 配置代理服务器
    proxy: {
      '/api': {
        target: `http://localhost:${conf_local.api_port}`,
        pathRewrite: {
          '^/api': '/api'
        }
      }
    },

    // 编译的状态
    stats: { colors: true }
  });

  server.listen(opts.port, function() {
    console.log('dev 测试服务 ' + opts.port);
    opn('http://localhost:' + opts.port, { app: 'chrome' });
  });
}
// build模式
else {
  var build_css = [
    // css
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          // 
          "css-loader",
          // 
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 10 versions', 'Firefox >= 20', 'Android >= 4.0', 'iOS >= 8']
                }),
              ]
            }
          },
        ]
      })
    },
    // less
    {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          // 
          "css-loader",
          // 
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer')({
                  browsers: ['last 10 versions', 'Firefox >= 20', 'Android >= 4.0', 'iOS >= 8']
                }),
              ]
            }
          },
          // 
          'less-loader',
        ]
      })
    },
  ];
  new_rules = rules.concat(build_css);
  const build = {
    entry: {
      index: `${opts.src}index.js`,
    },
    output: {
      // 1.指定输出的根目录
      path: path.resolve(__dirname, build_base_str),
      // 2.入口文件的输出名字
      filename: '[name].[hash:7].js',
      // 3.给页面所有加载文件提供一个专用地址或线上地址
      // publicPath: '/dist/',
      // 4.给require.ensure用：异步加载文件的真正的生成路径
      chunkFilename: 'async.[name].[hash:7].js',
    },
    plugins: [
      // -------------------------------------css--生成的地方
      new ExtractTextPlugin('[name].[hash:7].css'),
      // -------------------------------------压缩JS文件
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),

      // ------------------------------------模板入口--各是各自的脚本
      new HtmlWebpackPlugin({
        // 模版文件
        template: `${one}index.html`,
        // 以上面的出口的配置为基础。
        filename: 'index.html',

        // 里面所有的引入都是按照 index.html这层所在地址 进行相对路径写的。
      }),

      // -------------------------------------清除
      // 清除 文件和文件夹
      new CleanPlugin(['*.js', '*.css', '*.css.map', "*.html", opts.img, opts.font], {
        root: path.resolve(__dirname, build_base_str),
        verbose: true,
        dry: false,
        // exclude: ['common', 'lib', 'API.js']
      }),
    ],
    // 使用loader模块
    module: {
      rules: new_rules
    },
  };
  webpack(build, function(err, stats) {
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n');
  });
}
