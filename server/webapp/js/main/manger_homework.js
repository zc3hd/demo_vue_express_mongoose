(function($) {
  function homework() {
    this.API = new cc.module["API"];

    this.dom_active = null;
  }
  homework.prototype = {
    init: function() {
      var me = this;
      me._list();
    },
    // ---------------------------------------------------------------------课程列表
    // 加载权限的信息
    _list: function() {
      var me = this;
      var dom = $('#user_menus .active a');
      me.dom_active = dom;

      me.API.hw.find_all_homeworks()
        .done(function(data) {
          // 拿到所有权限的数据
          $('.h1_padding').html(me.dom_active.html());
          me._list_render(data);
          $('#content_container .table-bordered th,#content_container .table-bordered td').addClass('text-center');
          me._add();
          me._upd_del();
        });
    },
    // 信息列表渲染
    _list_render: function(data) {
      var me = this;
      $('#u_list').html('');
      if (data.length == 0) {
        layer.msg('没有课程信息~~');
        return;
      }
      var str = '';
      for (var i = 0; i < data.length; i++) {
        str += '' +
          '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + data[i].name + '</td>' +
          '<td>' + data[i].info + '</td>' +
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
    // -----------------------------------修改删除
    _upd_del: function() {
      var me = this;
      $('#u_list').unbind().on('click', '.btn_update,.btn_delete', function(e) {
        var _id = $(e.target).attr('uid');

        var _update = $(e.target).hasClass('btn_update');
        var _delete = $(e.target).hasClass('btn_delete');

        var _p = $(e.target).parent().parent();

        var name = _p.children().eq(1).html();
        var info = _p.children().eq(2).html();

        if (_update) {
          me._upd({ _id: _id, name: name, info: info });
          return;
        };
        if (_delete) {
          me._del({ _id: _id });
          return;
        };
      });
    },
    // ----------------------------------------修改
    _upd: function(obj) {
      var me = this;
      layer.open({
        type: 1,
        area: ['50%', '30%'],
        shadeClose: false, //点击遮罩关闭
        title: '编辑课程',
        btn: ['修改', '取消'],
        content: '' +
          '<div>' +
          '<div style="margin-top:5px;margin-left:20px">课名：<input type="text" style="width:80%" id="add_name" value =' + obj.name + '></div>' +
          '<div style="margin-top:5px;margin-left:20px">描述：<input type="text" style="width:80%" id="add_info" value =' + obj.info + '></div>' +
          '</div>',
        success: function() {},
        btn1: function(index, layero) {
          me._upd_done(index, obj._id);
        },
        btn2: function(index, layero) {
          layer.close(index);
        },
      });
    },
    _upd_done: function(index, _id) {
      var me = this;
      var name = $('#add_name').val();
      if (name == '') {
        layer.msg('不能为空~~');
        return;
      };
      var info = $('#add_info').val();
      // 修改用户
      me.API.hw.homework_upd({
        "_id": _id,
        "name": name,
        "info": info
      }).done(function(data) {
        layer.close(index);
        layer.msg('修改课程成功~~');

        me._list();
      });
    },
    // ----------------------------------------删除
    _del: function(obj) {
      var me = this;
      layer.open({
        type: 1,
        area: 'auto',
        shadeClose: false, //点击遮罩关闭
        title: '处理课程',
        btn: ['处理', '取消'],
        content: '' +
          '<div style="margin-top:5px;margin-left:20px">亲~~要处理该课程么？</div>',
        btn1: function(index, layero) {
          me._del_done(index, obj._id);
        },
        btn2: function(index, layero) {
          layer.close(index);
        },
      });
    },
    _del_done: function(index, _id) {
      var me = this;
      me.API.hw.homework_del({
        "_id": _id,
      }).done(function(data) {
        layer.close(index);
        layer.msg('处理课程成功~~');
        me._list();
      });
    },
    // ----------------------------------------添加
    _add: function() {
      var me = this;
      $('#u_add').unbind().on('click', function() {
        layer.open({
          type: 1,
          area: ['50%', '30%'],
          shadeClose: false, //点击遮罩关闭
          title: '添加新课程',
          btn: ['添加', '取消'],
          content: '' +
            '<div>' +
            '<div style="margin-top:5px;margin-left:20px">课名：<input type="text" style="width:80%" id="add_name"></div>' +
            '<div style="margin-top:5px;margin-left:20px">描述：<input type="text" style="width:80%" id="add_info"></div>' +
            '</div>',
          success: function() {},
          btn1: function(index, layero) {
            me._add_done(index);
          },
          btn2: function(index, layero) {
            layer.close(index);
          },
        });
      });
    },
    // 添加成功
    _add_done: function(index) {
      var me = this;
      var name = $('#add_name').val();
      if (name == '') {
        layer.msg('课程名不能为空~~');
        return;
      };
      var info = $('#add_info').val();

      // 添加用户
      me.API.hw.homework_add({
        "name": name,
        "info": info,
      }).done(function(data) {
        layer.close(index);
        layer.msg('添加课程成功~~');

        me._list();
      });
    },
  };
  new homework().init();
})(jQuery);
