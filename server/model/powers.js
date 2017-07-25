var mongoose = require('mongoose');

//schema
var PowerSchema = new mongoose.Schema({
  "id": String,
  "name": String,
  "path": String,
  "logo":String,
});

//model
var power = mongoose.model("power", PowerSchema);

// {
//   id: "3",
//   name: '围栏设置',
//   path: '/undone',
//   logo: 'el-icon-setting',
// },

// --------------------admin
// power.create({
//   id: "0",
//   name: '用户列表',
//   path: '/user_manage',
//   logo: 'el-icon-setting',
// });
// power.create({
//   id: "1",
//   name: '设备列表',
//   path: '/dev_manage',
//   logo: 'el-icon-date',
// });
// power.create({
//   id: "2",
//   name: '全局监控',
//   path: '/all_monitor',
//   logo: 'el-icon-upload',
// });

// // -------------------user
// power.create({
//   id: "3",
//   name: '我的设备',
//   path: '/self_monitor',
//   logo: 'el-icon-star-on',
// });
// power.create({
//   id: "4",
//   name: '围栏设置',
//   path: '/fence_manage',
//   logo: 'el-icon-menu',
// });
// power.create({
//   id: "5",
//   name: '轨迹回放',
//   path: '/see_trails',
//   logo: 'el-icon-date',
// });

module.exports = power;
