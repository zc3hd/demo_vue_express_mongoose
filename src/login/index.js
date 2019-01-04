export default {
  data() {
      return {
        // 所有的配置项
        conf: {
          key: "sign",
        },
        // 弹窗中数据
        obj: {
          // 
          name: '',
          ps: '',
        },
        api: {
          // 登录
          login: "/api/user/login.do",
          // 
          register: "/api/user/register.do",
        },

      }
    },
    mounted() {},
    methods: {
      // 
      ev: function() {
        var me = this;
        switch (me.conf.key) {
          case "sign":
            me.ev_sign();
            break;
          case "register":
            me.ev_register();
            break;
        }
      },
      // 登录
      ev_sign: function() {
        var me = this;

        if (me.obj.name == '') {
          me.$ele_msg.error('name cannot be null xxxxx');
          return;
        }
        if (me.obj.ps == '') {
          me.$ele_msg.error('ps cannot be null');
          return;
        }
        // 登录
        me.$ajax
          .post(me.api.login, {
            name: me.obj.name,
            ps: me.obj.ps
          })
          .then(function(data) {
            data = data.data;
            if (data.res == -1) {
              me.$ele_msg.error(data.desc);
              return;
            }


            me.ev_done(data);

          });
      },
      // 注册
      ev_register: function() {
        var me = this;

        if (me.obj.name == '') {
          me.$ele_msg.error('name can not null');
          return;
        }
        if (me.obj.name.length >= 10) {
          me.$ele_msg.error('name 不能超过10个字符');
          return;
        }

        if (me.obj.ps == '') {
          me.$ele_msg.error('ps can not null');
          return;
        }
        if (me.obj.ps.length >= 10) {
          me.$ele_msg.error('ps 不能超过10个字符');
          return;
        }

        // 登录
        me.$ajax
          .post(me.api.register, {
            name: me.obj.name,
            ps: me.obj.ps,
          })
          .then(function(data) {
            data = data.data;
            // 错误的时候
            if (data.name == "MongoError") {
              me.$ele_msg.error(`用户名${me.obj.name}已被占用！`);
              me.obj.name = '';
              return;
            }

            me.ev_done(data);
            // 
            // me.$store.commit('user_suc', { _id: data._id });
          });
      },
      // 成功的函数
      ev_done: function(data) {
        var me = this;
        me.$ele_msg({
          message: `welcome ${data.name}`,
          type: 'success'
        });
        // 记录ID值
        $.session.set('_id', data._id);

        setTimeout(function() {
          // view 控制样式
          me.$store.commit('change_view', "");
          // nav 显示
          me.$store.commit('change_nav', true);
          
        }, 1000);

      },




    },
    watch: {},

}
