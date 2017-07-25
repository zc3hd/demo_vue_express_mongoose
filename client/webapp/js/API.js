(function($) {
  function API() {};
  //将设备服务模型添加到全局变量中
  API.prototype = {
    line:{
      // 新增轨迹
      L_add:cc.api_root+"/L_add",
      // 所有轨迹
      L_all:cc.api_root+"/L_all",
    },
    fence:{
      f_all_fence:cc.api_root+"/f_all_fence",
      // 修改围栏
      f_upd:cc.api_root+"/f_upd",
      // 删除围栏
      f_del:cc.api_root+"/f_del",
      // add
      f_add:cc.api_root+"/f_add",
    },
    dev:{
      // 分页查询
      f_dev_by_page:cc.api_root+"/f_dev_by_page",
      // 设置加
      dev_add:cc.api_root+"/dev_add",
      // check
      check_sn:cc.api_root+"/check_sn",
      // 设置upd
      dev_upd:cc.api_root+"/dev_upd",
      // 删除--
      dev_del:cc.api_root+"/dev_del",
      // 查询一个设置
      dev_f_one:cc.api_root+"/dev_f_one",
      // 修改定位
      dev_upd_pos:cc.api_root+"/dev_upd_pos",
      // 查询地图上的所有点
      f_devs_map:cc.api_root+"/f_devs_map",
    },
    user:{
      // 登录
      sign_in:cc.api_root+"/sign_in",
      // 注册
      reg_in:cc.api_root+"/reg_in",
      // 检查用户名
      check_name:cc.api_root+"/check_name",
      // 查询所选权限
      find_power:cc.api_root+"/find_power",
      // 所有用户
      find_all_users:cc.api_root+"/find_all_users",
      // 分页用户查询
      find_users_by_page:cc.api_root+"/find_users_by_page",
      // 通过名字查用户
      find_users_by_name:cc.api_root+"/find_users_by_name",
      // 查询用户总数
      find_all_users_count:cc.api_root+"/find_all_users_count",
      // 添加用户
      user_add:cc.api_root+"/user_add",
      // 修改用户
      user_upd:cc.api_root+"/user_upd",
      // 修改密码
      user_upd_pw:cc.api_root+"/user_upd_pw",
      // 删除用户
      user_del:cc.api_root+"/user_del",
      // 绑定设置
      user_on_sn:cc.api_root+"/user_on_sn",
      // 解除绑定
      user_off_sn:cc.api_root+"/user_off_sn",
    },
    power:{
      // 获取所有的权限
      find_all_power:cc.api_root+"/find_all_power",
    },
  };
  cc.module["API"] = API;
})(jQuery);
