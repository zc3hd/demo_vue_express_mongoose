(function($) {
  function API() {};
  API.prototype = {
    // ----------------------------------homework
    hw: {
      // 查询所有课程
      find_all_homeworks: function(requestModel) {
        return $.ajax({
          url: "/find_all_homeworks",
          dataType: "json",
          type: "post",
          // data: requestModel,
        });
      },
      // 添加课程
      homework_add: function(requestModel) {
        return $.ajax({
          url: "/homework_add",
          dataType: "json",
          type: "post",
          data: requestModel,
        });
      },
      // 修改
      homework_upd: function(requestModel) {
        return $.ajax({
          url: "/homework_upd",
          dataType: "json",
          type: "post",
          data: requestModel,
        });
      },
      // 删除
      homework_del: function(requestModel) {
        return $.ajax({
          url: "/homework_del",
          dataType: "json",
          type: "post",
          data: requestModel,
        });
      },
    },
    // ----------------------------------user_homeworks
    uhs: {
      // 保存所选课程
      user_save_homeworks: function(requestModel) {
        return $.ajax({
          url: "/user_save_homeworks",
          dataType: "json",
          type: "post",
          data: requestModel,
        });
      },
      // 提交个人--课程--评价
      user_assess_homework:function (requestModel) {
        return $.ajax({
          url: "/user_assess_homework",
          dataType: "json",
          type: "post",
          data: requestModel,
        });
      },
      // 根据用户找评价
      user_assess_find_by_name:function (requestModel) {
        return $.ajax({
          url: "/user_assess_find_by_name",
          dataType: "json",
          type: "post",
          data: requestModel,
        });
      }
    },
    // ---------------------------------用户
    // 登录
    sign_in: function(requestModel) {
      return $.ajax({
        url: "/sign_in",
        dataType: "json",
        type: "post",
        data: requestModel,
      });
    },
    // 用户信息
    find_all_users: function(requestModel) {
      return $.ajax({
        url: "/find_all_users",
        dataType: "json",
        type: "post",
        // data: requestModel,
      });
    },
    // 用户添加
    user_add: function(requestModel) {
      return $.ajax({
        url: "/user_add",
        dataType: "json",
        type: "post",
        data: requestModel,
      });
    },
    // 修改用户
    user_upd: function(requestModel) {
      return $.ajax({
        url: "/user_upd",
        dataType: "json",
        type: "post",
        data: requestModel,
      });
    },
    user_del: function(requestModel) {
      return $.ajax({
        url: "/user_del",
        dataType: "json",
        type: "post",
        data: requestModel,
      });
    },
    find_users_by_name: function(requestModel) {
      return $.ajax({
        url: "/find_users_by_name",
        dataType: "json",
        type: "post",
        data: requestModel,
      });
    },
    // --------------------------------权限
    // 查找选中权限
    find_power: function(requestModel) {
      return $.ajax({
        url: "/find_power",
        dataType: "json",
        type: "post",
        data: requestModel,
      });
    },
    // 查询所有权限
    find_all_power: function(requestModel) {
      return $.ajax({
        url: "/find_all_power",
        dataType: "json",
        type: "post",
        // data: requestModel,
      });
    },
  };
  //将设备服务模型添加到全局变量中
  cc.module["API"] = API;
})(jQuery);
