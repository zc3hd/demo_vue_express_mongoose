(function($) {
  function User() {
    this.API = new cc.module["API"];
    // 所有的权限数据
    this.powers_datas = null;

    this.dom_active = null;
  }
  User.prototype = {
    init: function() {
      var me = this;
      me.user_list();
    },
    // ---------------------------------------------------------------------用户信息
    // 加载权限的信息
    user_list: function() {
      var me = this;
      var dom = $('#user_menus .active a');
      me.dom_active = dom;

      me.API.find_all_power()
        .done(function(data) {
          // 拿到所有权限的数据
          me.powers_datas = data;

          me.user_list_ajax();
        });
    },
    // 用户信息ajax
    user_list_ajax: function() {
      var me = this;
      // 再请求所有的用户的数据
      me.API.find_all_users()
        .done(function(udata) {
          // 表头
          $('.h1_padding').html(me.dom_active.html());
          me.user_list_render(udata);
          $('#content_container .table-bordered th,#content_container .table-bordered td').addClass('text-center');
          me.user_add();
          me.user_upd_del();
        });
    },
    // 信息列表渲染
    user_list_render: function(data) {
      var me = this;
      if (data.length == 0) {
        layer.msg('没有用户信息~~');
        return;
      }
      $('#u_list').html('');
      var str = '';
      for (var i = 0; i < data.length; i++) {
        str += '' +
          '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + data[i].name + '</td>' +
          '<td powers = ' + data[i].powers + '>' + me.user_power_info(data[i].powers) + '</td>' +
          '<td>' +
          // update
          '<button type="button" class="btn btn-info btn-xs btn_update" uid = ' + data[i]._id + '>' +
          '<span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>update' +
          '</button>' +
          // delete
          '<button type="button" class="btn btn-danger btn-xs btn_delete" uid = ' + data[i]._id + '>' +
          '<span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span>delete' +
          '</button>' +
          '</td>' +
          '</tr>';
      };
      $('#u_list').html(str);
    },
    // 用户的权限文字
    user_power_info: function(data) {
      var me = this;
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        for (var k = 0; k < me.powers_datas.length; k++) {
          if (data[i] == me.powers_datas[k].key) {
            arr.push(me.powers_datas[k].name);
            break;
          }
        }
      }
      return arr.join(' • ');
    },
    // -----------------------------------修改删除
    user_upd_del: function() {
      var me = this;
      $('#u_list').unbind().on('click', '.btn_update,.btn_delete', function(e) {
        var _id = $(e.target).attr('uid')

        var _update = $(e.target).hasClass('btn_update');
        var _delete = $(e.target).hasClass('btn_delete');
        var _p = $(e.target).parent().parent();

        var name = _p.children().eq(1).html();
        var powers = _p.children().eq(2).attr('powers');

        if (_update) {
          me.user_upd({ _id: _id, name: name, powers: powers });
          return;
        };
        if (_delete) {
          me.user_del({ _id: _id });
          return;
        };
      });
    },
    // ----------------------------------------修改
    user_upd: function(obj) {
      var me = this;
      layer.open({
        type: 1,
        area: ['50%', '50%'],
        shadeClose: false, //点击遮罩关闭
        title: '编辑用户',
        btn: ['修改', '取消'],
        content: '' +
          '<div>' +
          '<div style="margin-top:5px;margin-left:20px">姓名：<input type="text" style="width:80%" id="add_name" value =' + obj.name + '></div>' +
          '<div style="margin-top:5px;margin-left:60px;overflowY:hidden" id="power_list">' +

          '</div>' +
          '</div>',
        success: function() {
          // 用已经拿到的权限数据
          var data = me.powers_datas;
          var sel_date = obj.powers.split(',');
          $('#power_list').html("");
          var str = '';
          var ck = '';
          for (var i = 0; i < data.length; i++) {
            for (var K = 0; K < sel_date.length; K++) {
              if (data[i].key == sel_date[K]) {
                ck = '<input type="checkbox" name = "power" value = ' + data[i].key + ' checked> ' + data[i].name;
                break;
              }
              ck = '<input type="checkbox" name = "power" value = ' + data[i].key + '> ' + data[i].name;
            }

            str += '' +
              '<div class="checkbox">' +
              '<label>' +
              ck +
              '</label>' +
              '</div>';
          };
          $('#power_list').html(str);
        },
        btn1: function(index, layero) {
          me.user_upd_done(index, obj._id);
        },
        btn2: function(index, layero) {
          layer.close(index);
        },
      });
    },
    user_upd_done: function(index, _id) {
      var me = this;
      var name = $('#add_name').val();
      if (name == '') {
        layer.msg('用户名不能为空~~');
        return;
      };
      var powers = $("#power_list input:checkbox[name='power']:checked").map(function(index, elem) {
        return $(elem).val();
      }).get().join(',');

      // 修改用户
      me.API.user_upd({
        "_id": _id,
        "name": name,
        "powers": powers
      }).done(function(data) {
        layer.close(index);
        layer.msg('修改用户成功~~');

        me.user_list_ajax();
      });
    },
    // ----------------------------------------删除
    user_del: function(obj) {
      var me = this;
      layer.open({
        type: 1,
        area: 'auto',
        shadeClose: false, //点击遮罩关闭
        title: '处理用户',
        btn: ['处理', '取消'],
        content: '' +
          '<div style="margin-top:5px;margin-left:20px">亲~~要处理该用户么？</div>',
        btn1: function(index, layero) {
          me.user_del_done(index, obj._id);
        },
        btn2: function(index, layero) {
          layer.close(index);
        },
      });
    },
    user_del_done: function(index, _id) {
      var me = this;
      me.API.user_del({
        "_id": _id,
      }).done(function(data) {
        layer.close(index);
        layer.msg('处理用户成功~~');
        me.user_list_ajax();
      });
    },
    // ----------------------------------------添加
    user_add: function() {
      var me = this;
      $('#u_add').unbind().on('click', function() {
        layer.open({
          type: 1,
          area: ['50%', '50%'],
          shadeClose: false, //点击遮罩关闭
          title: '添加新用户',
          btn: ['添加', '取消'],
          content: '' +
            '<div>' +
            '<div style="margin-top:5px;margin-left:20px">姓名：<input type="text" style="width:80%" id="add_name"></div>' +
            '<div style="margin-top:5px;margin-left:60px;overflowY:hidden" id="power_list">' +

            '</div>' +
            '</div>',
          success: function() {
            // 用已经拿到的权限数据
            var data = me.powers_datas;
            $('#power_list').html("");
            var str = '';
            for (var i = 0; i < data.length; i++) {
              str += '' +
                '<div class="checkbox">' +
                '<label>' +
                '<input type="checkbox" name = "power" value = ' + data[i].key + '> ' + data[i].name +
                '</label>' +
                '</div>';
            };
            $('#power_list').html(str);
          },
          btn1: function(index, layero) {
            me.user_add_done(index);
          },
          btn2: function(index, layero) {
            layer.close(index);
          },
        });
      });
    },
    // 添加用户
    user_add_done: function(index) {
      var me = this;
      var name = $('#add_name').val();
      if (name == '') {
        layer.msg('用户名不能为空~~');
        return;
      };
      var powers = $("#power_list input:checkbox[name='power']:checked").map(function(index, elem) {
        return $(elem).val();
      }).get().join(',');

      // 添加用户
      me.API.user_add({
        "name": name,
        "password": hex_md5(cc.password),
        "powers": powers
      }).done(function(data) {
        layer.close(index);
        layer.msg('添加用户成功~~');

        me.user_list_ajax();
      });
    },
  };

  new User().init();

})(jQuery);
