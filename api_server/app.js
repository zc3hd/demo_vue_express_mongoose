/**
 * Created by CC on 2017/3/22
 * Update  by CC on 2019/1/4
 */
var express = require("express");
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var conf = require('../conf.js');
process.env.NODE_ENV = process.env.NODE_ENV || "process.env.NODE_ENV";


// =====================================================连接数据库
mongoose.connect('mongodb://localhost/' + conf.db);
// 链接数据库
mongoose.connection.once('open', function() {
  console.log('数据库已连接');
});


// =====================================================API
// 提供所有的API
function API(app) {

  // post应该放在内部，不然就没有设置post
  // app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // 登录模块
  var login_api = require('./modules/login_api.js');
  new login_api(app).init();

  // 设备
  var dev_api = require('./modules/dev_api.js');
  new dev_api(app).init();

  // 围栏
  var fence_api = require('./modules/fence_api.js');
  new fence_api(app).init();

  // 轨迹
  var line_api = require('./modules/line_api.js');
  new line_api(app).init();

  // 权限
  var power_api = require('./modules/power_api.js');
  new power_api(app).init();

  // 用户
  var user_api = require('./modules/user_api.js');
  new user_api(app).init();
}


// dev 就是提供API服务
if (process.env.NODE_ENV == 'dev') {
  // 
  module.exports = function(app) {
    API(app);
  };
}
// build 的服务
else {
  // 提供静态文件
  app.use(express.static(path.join(__dirname, '../webapp/')));
  // 提供api服务
  API(app);
  // api端口
  app.listen(conf.api_port);
  console.log('build完成 服务启动--->' + conf.api_port);
}










// ------------------------------------------设置session
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// app.use('/sign_in',session({
//   secret: 'cc',
//   saveUninitialized: true,
//   resave: false,
//   // rolling:true,
//   store: new MongoStore({
//     // db: db,
//     url: 'mongodb://localhost/vue-demo',
//     // interval: 120000
//     ttl: 7 * 24 * 60 * 60
//   }),
//   cookie: { secure: false, maxAge: 10 * 3600000 ,Domain:'172.169.0.139'}
// }));
