// 登录组件
const Login = resolve => require([
  './login/index.vue'
], resolve);


// 设备监控
const map_monitor = resolve => require([
  './map_monitor/index.vue'
], resolve);

// // 用户列表
// const Users_list = resolve => require(['./components/Users_list.vue'], resolve);
// // 设备列表
// const Devs_list = resolve => require(['./components/Devs_list.vue'], resolve);
// // 围栏设置
// const Fence_set = resolve => require(['./components/Fence_set.vue'], resolve);

// // 我的监控
// const Devs_moniter = resolve => require(['./components/Devs_moniter.vue'], resolve);

// // 轨迹回放
// const Trail_lines = resolve => require(['./components/Devs_history_lines.vue'], resolve);



export default [
  // // 用户管理
  // {
  //   path: '/user_manage',
  //   component: Users_list
  // },
  // //  我的设备
  // {
  //   path: '/self_monitor',
  //   component: Devs_moniter
  // },

  // // 设备管理
  // {
  //   path: '/dev_manage',
  //   component: Devs_list
  // },
  // // 围栏管理
  // {
  //   path: '/fence_manage',
  //   component: Fence_set
  // },
  // // 全部的设备
  {
    path: '/monitor',
    component: map_monitor
  },
  // // 轨迹回放
  // {
  //   path: '/see_trails',
  //   component: Trail_lines
  // },

  // 登录
  {
    path: '/login',
    component: Login
  },
  // ----------------
  {
    path: '*',
    redirect: '/login'
  }
]
