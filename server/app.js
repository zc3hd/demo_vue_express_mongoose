/**
 * Created by CC on 2017/3/22.
 */
var express = require("express");
var app = express();
// 路由控制器
var router = require("./controller/router.js");
// 数据库
var db = require("./model/db.js");
// 设置静态文件
app.use(express.static("./webapp"));

// post -----------------------------------请求中间件
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// ----------------------------------------配置跨域
var cors = require('cors');
app.use(cors());

// -------------------------------------------轨迹
app.post("/L_add", urlencodedParser, router.L_add);
// 所有
app.post("/L_all", urlencodedParser, router.L_all);


// -------------------------------------------围栏
app.post("/f_all_fence", urlencodedParser, router.f_all_fence);
// 修改围栏
app.post("/f_upd", urlencodedParser, router.f_upd);
// 删除围栏
app.post("/f_del", urlencodedParser, router.f_del);
// add
app.post("/f_add", urlencodedParser, router.f_add);






// --------------------------------------------设备
// 分页查询数据
app.post("/f_dev_by_page", urlencodedParser, router.f_dev_by_page);
// +
app.post("/dev_add", urlencodedParser, router.dev_add);
// check
app.post("/check_sn", urlencodedParser, router.check_sn);
// 
app.post("/dev_upd", urlencodedParser, router.dev_upd);
// 修改经纬度
app.post("/dev_upd_pos", urlencodedParser, router.dev_upd_pos);
// 删除
app.post("/dev_del", urlencodedParser, router.dev_del);
// findone
app.post("/dev_f_one", urlencodedParser, router.dev_f_one);

// 查询地图上的讹所有点
app.post("/f_devs_map", urlencodedParser, router.f_devs_map);




// --------------------------------------------用户
// 登录
app.post("/sign_in", urlencodedParser, router.sign_in);
// 检查用户名
app.post("/check_name", urlencodedParser, router.check_name);
// 注册
app.post("/reg_in", urlencodedParser, router.reg_in);
// 读取所有用户
app.post("/find_all_users", urlencodedParser, router.find_all_users);
// 查询用户总数
app.post("/find_all_users_count", urlencodedParser, router.find_all_users_count);
// 分页查询数据
app.post("/find_users_by_page", urlencodedParser, router.find_users_by_page);
// 添加用户
app.post("/user_add", urlencodedParser, router.user_add);
// 修改用户
app.post("/user_upd", urlencodedParser, router.user_upd);
// 修改密码
app.post("/user_upd_pw", urlencodedParser, router.user_upd_pw);
// 删除用户
app.post("/user_del", urlencodedParser, router.user_del);
// 绑定设备
app.post("/user_on_sn", urlencodedParser, router.user_on_sn);
// 解除
app.post("/user_off_sn", urlencodedParser, router.user_off_sn);
// 查找用户
app.post("/find_users_by_name", urlencodedParser, router.find_users_by_name);


// --------------------------------------------权限
// 查询选中权限
app.post("/find_power", urlencodedParser, router.find_power);
// 查询所有权限
app.post("/find_all_power", urlencodedParser, router.find_all_power);



app.listen(3000);



// ---------------------------------------设置session
// var session = require('express-session');
// var connect = require('connect');
// cookie解析中间件
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());
// var MongoStore = require('connect-mongodb');
// var MongoStore = require('connect-mongo')(session);
// app.use(session({
//   secret: 'cc',
//   resave: false,
//   saveUninitialized: true,
//   store: new MongoStore({
//   	// db: db,
//   	url:'mongodb://localhost/vue-demo'
//   })
// }));
