/**
 * Created by CC on 2017/3/22.
 */
var express = require("express");
var app = express();
// 路由控制器
// var router = require("./controller/router.js");
// 数据库
var db = require("./model/db.js");
// 设置静态文件
app.use(express.static("./webapp"));

// post -----------------------------------请求中间件
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------配置跨域
var cors = require('cors');
app.use(cors());

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
//   cookie: { secure: false, maxAge: 10 * 3600000 }
// }));


// ----------------------------------------------api
var router = require("./route.js");
app.use(router);

app.listen(3000);
