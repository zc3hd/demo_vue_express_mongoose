var express = require('express');
var router = express.Router();
var rs = require("./controller/router.js");

// -------------------------------------------轨迹
router.post("/L_add", rs.L_add);
// 所有
router.post("/L_all", rs.L_all);


// -------------------------------------------围栏
router.post("/f_all_fence", rs.f_all_fence);
// 修改围栏
router.post("/f_upd", rs.f_upd);
// 删除围栏
router.post("/f_del", rs.f_del);
// add
router.post("/f_add", rs.f_add);


// --------------------------------------------设备
// 分页查询数据
router.post("/f_dev_by_page", rs.f_dev_by_page);
// +
router.post("/dev_add", rs.dev_add);
// check
router.post("/check_sn", rs.check_sn);
// 
router.post("/dev_upd", rs.dev_upd);
// 修改经纬度
router.post("/dev_upd_pos", rs.dev_upd_pos);
// 删除
router.post("/dev_del", rs.dev_del);
// findone
router.post("/dev_f_one", rs.dev_f_one);

// 查询地图上的讹所有点
router.post("/f_devs_map", rs.f_devs_map);




// --------------------------------------------用户
// 登录
router.post("/sign_in", rs.sign_in);
// 检查用户名
router.post("/check_name", rs.check_name);
// 注册
router.post("/reg_in", rs.reg_in);
// 读取所有用户
router.post("/find_all_users", rs.find_all_users);
// 查询用户总数
router.post("/find_all_users_count", rs.find_all_users_count);
// 分页查询数据
router.post("/find_users_by_page", rs.find_users_by_page);
// 添加用户
router.post("/user_add", rs.user_add);
// 修改用户
router.post("/user_upd", rs.user_upd);
// 修改密码
router.post("/user_upd_pw", rs.user_upd_pw);
// 删除用户
router.post("/user_del", rs.user_del);
// 绑定设备
router.post("/user_on_sn", rs.user_on_sn);
// 解除
router.post("/user_off_sn", rs.user_off_sn);
// 查找用户
router.post("/find_users_by_name", rs.find_users_by_name);


// --------------------------------------------权限
// 查询选中权限
router.post("/find_power", rs.find_power);
// 查询所有权限
router.post("/find_all_power", rs.find_all_power);


module.exports = router;