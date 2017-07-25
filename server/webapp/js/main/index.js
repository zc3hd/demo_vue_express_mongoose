(function($) {
  function Main() {
    this.API = new cc.module["API"];
  }
  Main.prototype = {
    init: function() {
      /* body... */
      var me = this;
      var name = $.session.get('name');
      var password = $.session.get('password');
      // 常登录
      if (name && password) {
        me.sign_long(name, password);
      }
      // 初始登录
      else {
        me.sign_init();
        me.sign_btn_event();
      }
    },
    // -----------------------------------------常登录
    sign_long: function(name, password) {
      var me = this;
      me.API.sign_in({
          name: name,
          password: password
        })
        .done(function(data) {
          // 
          $.session.set('course', data.course.join(','));

          $('#main_index').load('./temple_html/main_index.html', function(argument) {
            me.user_in(data);
          });
        });
    },
    // ------------------------------------------登录
    // 初始登录
    sign_init: function() {
      var me = this;
      layer.open({
        type: 1,
        area: ['300px', '200px'],
        shadeClose: false, //点击遮罩关闭
        title: '用户登录/注册',
        btn: ['登录', '注册'],
        content: '' +
          '<div>' +
          '<div style="margin-top:5px;margin-left:20px">姓名：<input type="text" style="width:90%" id="name"></div>' +
          '<div style="margin-top:5px;margin-left:20px">密码：<input type="password" style="width:90%" id="password"></div>' +
          '</div>',
        btn1: function(index, layero) {
          me.sign_done(index);
        },
        btn2: function(index, layero) {
          layer.close(index);
          me.user_register();
        },
      });
    },
    // 确认登录
    sign_done: function(index) {
      var me = this;
      // 设置session
      

      me.API.sign_in({
          name: $('#name').val(),
          password: hex_md5($('#password').val())
        })
        .done(function(data) {
          // 登录成功后会记录选择的课程

          
          me.sign_handle(index, data);
        });
    },
    // 登录返回数据处理
    sign_handle: function(index, data) {
      var me = this;
      if (data.ret == -1) {
        layer.msg(data.info);
        return;
      }
      $.session.set('name', $('#name').val());
      $.session.set('password', hex_md5($('#password').val()));
      $.session.set('course', data.course.join(','));
      
      $('#main_index').load('./temple_html/main_index.html', function(argument) {
        layer.close(index);
        me.user_in(data);
      });
    },
    // 登录按钮的点击事件
    sign_btn_event: function() {
      var me = this;
      $('.login_btn').on('click', function() {
        me.sign_init();
      });
    },
    // ------------------------------------------注册
    user_register: function() {
      var me = this;
      layer.open({
        type: 1,
        area: ['300px', '300px'],
        shadeClose: false, //点击遮罩关闭
        title: '用户注册',
        btn: ['提交', '取消'],
        content: '' +
          '<div>' +
          '<div style="margin-top:5px;margin-left:20px">姓  名：<input type="text" style="width:90%" id="name"  autofocus="true"></div>' +
          '<div style="margin-top:5px;margin-left:20px">新密码：<input type="password" style="width:90%" id="password"></div>' +
          '<div style="margin-top:5px;margin-left:20px">再密码：<input type="password" style="width:90%" id="password_ag"></div>' +
          '</div>',
        success: function() {
          me.user_name_find()
        },
        btn1: function(index, layero) {
          me.user_register_done(index);
        },
        btn2: function(index, layero) {
          layer.close(index);
        },
      });
    },
    // 用户不能重复用
    user_name_find: function() {
      var me = this;
      $('#name').unbind().on('blur', function() {
        if($('#name').val()==''){
          layer.msg('亲~你的用户名不能为空~~');
          return;
        }
        me.API.find_users_by_name({ name: $('#name').val() })
          .done(function(data) {
            if(data.name){
              layer.msg('亲~你的用户名被被人用了~你再想个吧~~');
              $('#name').val('');
            }
          })
      })
    },
    user_register_done: function(index) {
      var me = this;
      var name = $('#name').val();
      var password = $('#password').val();
      var password_ag = $('#password_ag').val();
      if (password != password_ag) {
        layer.msg('两次密码输入不一致~');
        $('#password_ag').val('');
        return;
      }
      // 设置session
      $.session.set('name', $('#name').val());
      $.session.set('password', hex_md5($('#password').val()));


      // me.API.sign_in({
      //     name: $('#name').val(),
      //     password: hex_md5($('#password').val())
      //   })
      //   .done(function(data) {
      //     me.sign_handle(index, data);
      //   });

      me.API.user_add({
        "name": name,
        "password": hex_md5(password),
        "powers": cc.powers.join(',')
      }).done(function(data) {
        // 注册成功

        $.session.set('course', '');
        // layer.msg('用户注册成功~~');
        me.sign_handle(index, data);
        
      });
    },
    // ------------------------------------------登录成功
    // 用户登录的数据渲染
    user_in: function(data) {
      var me = this;
      $('#welcome_user').html('welcome ' + data.name);
      var keys = data.powers.join(',');
      // 查询选择权限
      me.API.find_power({
          keys: keys
        })
        .done(function(Data) {
          me.user_menu(Data)
        });
    },
    // 用户的菜单渲染
    user_menu: function(data) {
      var me = this;
      $('#user_menus').html('');
      var str = '';
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          str += '<li class="active"><a href="#" src_html = ' + data[i].src + '>' + data[i].name + '</a></li>'
        } else {
          str += '<li><a href="#" src_html = ' + data[i].src + '>' + data[i].name + '</a></li>'
        }
      }
      str += '<li ><a href="#" id="user_update_pw">修改密码</a></li>' +
        '<li ><a href="#" id="user_sign_out">退出登陆</a></li>';
      $('#user_menus').html(str);
      var dom = $('#user_menus .active a');
      me.user_load_src(dom);
      me.user_menu_event();
      me.sign_out();
    },
    // 加载src,js自动渲染
    user_load_src: function(dom) {
      var me = this;
      $('#content_container').load('.' + dom.attr('src_html'));
    },
    // 功能按钮切换
    user_menu_event: function() {
      var me = this;
      var doms = $('#user_menus a');
      doms.each(function(index, ele) {
        $(ele).unbind().on('click', function() {
          var p = $(ele).parent();
          if (p.hasClass('active')) {
            return;
          }
          p.siblings().removeClass('active');
          p.addClass('active');
          if ($(ele).attr('src_html') != undefined) {
            $('#content_container').load('.' + $(ele).attr('src_html'));
          }
        });
      })
    },
    // -----------------------------------------退出登陆
    sign_out: function() {
      var me = this;
      $('#user_sign_out').unbind().on('click', function() {
        $.session.remove('name');
        $.session.remove('password');
        $.session.remove('course');

        // window.location.reload();//刷新当前页面.
        // console.log($.session.get('name'));
        // window.location.href = '/';
        window.location.href = "/";
      });
    },
  };
  cc.module["Main"] = Main;
})(jQuery);
