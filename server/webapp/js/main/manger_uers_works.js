(function($) {
  function homework() {
    this.API = new cc.module["API"];
    // 全部课程数据
    this.all_homeworks = null;
    this.dom_active = null;
  }
  homework.prototype = {
    init: function() {
      var me = this;
      me._list();
    },
    // ---------------------------------------------------------------------课程列表
    // 列表
    _list: function() {
      var me = this;
      var dom = $('#user_menus .active a');
      me.dom_active = dom;
      // 拿到后台所有课程
      me.API.hw.find_all_homeworks()
        .done(function(data) {
          // 渲染表头
          $('.h1_padding').html(me.dom_active.html());

          me.all_homeworks = data;

          me._list_users_works();
        });
    },
    _list_users_works: function() {
      var me = this;
      var user_homeworks = $.session.get('course');
      me._add();
      // 渲染列表
      me._list_render(user_homeworks);
      $('#content_container .table-bordered th,#content_container .table-bordered td').addClass('text-center');

      me._options();
    },
    // 信息列表渲染
    _list_render: function(user_homeworks) {
      var me = this;
      if (user_homeworks.length == 0) {
        layer.msg('您还没有添加课程呢~请先添加我校的课程吧~~');
        return;
      }
      var data = me._homework_info(user_homeworks.split(','));


      $('#u_list').html('');
      var str = '';
      for (var i = 0; i < data.length; i++) {
        str += '' +
          '<tr>' +
          '<td>' + (i + 1) + '</td>' +
          '<td>' + data[i].name + '</td>' +
          '<td>' + data[i].info + '</td>' +
          '<td>' +
          // learning
          '<button type="button" class="btn btn-info btn-xs btn_start_learning" uid = ' + data[i]._id + '>' +
          '<span class="glyphicon glyphicon-play" aria-hidden="true"></span>start_learn' +
          '</button>' +
          // pingjia
          '<button type="button" class="btn btn-primary btn-xs btn_assess" uid = ' + data[i]._id + '>' +
          '<span class="glyphicon glyphicon-pushpin" aria-hidden="true"></span>assess' +
          '</button>' +
          '</td>' +
          '</tr>';
      };
      $('#u_list').html(str);
    },
    // 课程的反选出的数据
    _homework_info: function(data) {
      var me = this;
      var arr = [];
      for (var i = 0; i < data.length; i++) {
        for (var k = 0; k < me.all_homeworks.length; k++) {
          if (data[i] == me.all_homeworks[k]._id) {
            arr.push(me.all_homeworks[k]);
            break;
          }
        }
      }
      return arr;
    },
    // -----------------------------------课程操作
    _options: function() {
      var me = this;
      $('#u_list').unbind().on('click', '.btn_start_learning,.btn_assess,.btn_delete', function(e) {
        var _id = $(e.target).attr('uid');

        var _start_learning = $(e.target).hasClass('btn_start_learning');
        var _assess = $(e.target).hasClass('btn_assess');
        var _delete = $(e.target).hasClass('btn_delete');

        var _p = $(e.target).parent().parent();

        var name = _p.children().eq(1).html();

        if (_start_learning) {
          layer.msg('开发中~~~~~~~~~~~~~~~~~~~~~~~~~~');
        }
        if (_assess) {
          me._assess({ _id: _id, name: name });
          return;
        };
      });
    },
    // ----------------------------------------评价
    _assess: function(obj) {
      var me = this;
      layer.open({
        type: 1,
        area: ['30%', '50%'],
        shadeClose: false, //点击遮罩关闭
        title: '课程评价',
        btn: ['提交', '取消'],
        content: '' +
          '<div>' +
          '<div style="margin-top:5px;margin-left:20px">课名：' + obj.name + '</div>' +
          '<div style="margin-top:5px;margin-left:20px"><span style="vertical-align: top">评价：</span><textarea style="width:80%;height:50%" id="assessment"></textarea ></div>' +
          '</div>',
        success: function() {
          // 通过用户名找评价
          me.API.uhs.user_assess_find_by_name({
              _id: obj._id,
              name: $.session.get('name')
            })
            .done(function(data) {
              $('#assessment').val(data.assessment);
            })
        },
        btn1: function(index, layero) {
          me._assess_done(index, obj._id);
        },
        btn2: function(index, layero) {
          layer.close(index);
        },
      });
    },
    _assess_done: function(index, _id) {
      var me = this;
      var name = $.session.get('name');
      var assessment = $('#assessment').val();
      // 修改用户
      me.API.uhs.user_assess_homework({
        "_id": _id,
        "name": name,
        "assessment": assessment
      }).done(function(data) {
        layer.close(index);
        layer.msg('课程评价成功~~');
        me._list_users_works();
      });
    },
    // ----------------------------------------添加
    _add: function() {
      var me = this;
      $('#u_add').unbind().on('click', function() {
        layer.open({
          type: 1,
          area: ['30%', '30%'],
          shadeClose: false, //点击遮罩关闭
          title: '添加我的课程',
          btn: ['添加', '取消'],
          content: '' +
            '<div>' +
            '<div style="margin-top:5px;margin-left:60px;overflowY:hidden" id="course_list">' +

            '</div>' +
            '</div>',
          success: function() {
            var user_homeworks = $.session.get('course');
            $('#course_list').html("");
            var str = '';
            var data = me.all_homeworks;
            for (var i = 0; i < data.length; i++) {
              str += '' +
                '<div class="checkbox">' +
                '<label>' +
                '<input type="checkbox" name = "course" value = ' + data[i]._id + '> ' + data[i].name +
                '</label>' +
                '</div>';
            };
            $('#course_list').html(str);
            // 没有选择课程
            if (user_homeworks == undefined) {
              return;
            }
            // 有选择的课程
            else {
              var arr = user_homeworks.split(',');
              var ipts = $("#course_list input:checkbox[name='course']");
              ipts.each(function(inx, ele) {
                for (var i = 0; i < arr.length; i++) {
                  if (arr[i] == $(ele).val()) {
                    $(ele).attr('checked', true);
                    break;
                  }
                }
              });
            }


          },
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
      var name = $.session.get('name');
      var arr = [];
      $("#course_list input:checkbox[name='course']:checked").each(function(index, elem) {
        arr.push($(elem).val());
      });
      var course = arr;
      if (course.length == 0) {
        layer.msg('学费都花了，好歹您选门课程学习啊~~');
        return;
      }

      me.API.uhs.user_save_homeworks({
          name: name,
          course: course.join(',')
        })
        .done(function(data) {
          layer.close(index);
          // 保存已经选择的课程
          $.session.set('course', course);
          me._list_users_works();
        })
    },
  };
  new homework().init();
})(jQuery);
