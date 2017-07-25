<template>
  <!-- <router-view></router-view> -->
  <div id="vm_login">
    <!-- **********************************按钮区****************************** -->
    <el-button type="primary" size="large" @click="login.visible = true" v-show='btn.show'>
      <i class="el-icon-upload"></i> login
    </el-button>
    <el-button type="primary" size="large" @click="reg.visible = true" v-show='btn.show'>
      <i class="cc-login-broadcast"></i> 注册
    </el-button>
    <el-button type="primary" size="large" @click="vis_init" v-show='btn.show'>
      <i class="cc-login-podium"></i> 游客
    </el-button>
    <!-- ***********************************弹窗区****************************** -->
    <!-- login********* -->
    <el-dialog :title="login.title" :visible.sync="login.visible" size="tiny" :modal="false">
      <el-form :model="login.form">
        <el-form-item label="name" :label-width="width">
          <el-input v-model="login.form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="password" :label-width="width">
          <el-input v-model="login.form.pw" auto-complete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="login.visible = false">out</el-button>
        <el-button type="primary" @click="login_yes">login</el-button>
      </div>
    </el-dialog>
    <!-- reg********* -->
    <el-dialog :title="reg.title" :visible.sync="reg.visible" size="tiny" :modal="false">
      <el-form :model="reg.form">
        <el-form-item :label="reg.form.name_label" :label-width="width">
          <el-input v-model="reg.form.name" auto-complete="off" @blur='check_name'></el-input>
        </el-form-item>
        <el-form-item :label="reg.form.sn_label" :label-width="width">
          <el-input v-model="reg.form.sn" auto-complete="off" @blur='check_sn'></el-input>
        </el-form-item>
        <el-form-item :label="reg.form.pw_label" :label-width="width">
          <el-input v-model="reg.form.pw" auto-complete="off" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reg.visible = false">out</el-button>
        <el-button type="primary" @click="reg_yes">reg</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'bg_login',
  data() {
    return {
      // ----------------按钮的一些状态
      btn: {
        show: true,
      },
      // ----------------登录
      login: {
        title: 'login',
        visible: false,
        form: {
          name: '',
          pw: '',
        },
        width: '50px'
      },
      // ----------------注册
      reg: {
        title: '注册',
        visible: false,
        form: {
          name_label: "登录名",
          name: '',
          pw_label: "登录密码",
          pw: '',
          sn_label: "设备名",
          sn: '',
        },
        width: '50px'
      },
      // -----------------游客
      vis: {
        time: 4500,
        name: 'visitor',
        pw: "123456",
      },





    }
  },
  methods: {
    // ---------------------------------------------------------登录
    init() {
      var me = this;
      var name = $.session.get('name');
      var pw = $.session.get('pw');
      var ps = $.session.get('ps');



      // 无登录状态
      if (name == undefined) {
        // 隐藏导航
        me.$store.dispatch('head_hide');

      }
      // 登录状态
      else {
        // 显示导航
        me.$store.dispatch('head_show');

        me.login.form.name = name;
        me.login.form.pw = pw;
        // 登录请求
        me.login_yes_done();
      }


    },

    // login
    login_yes() {
      var me = this;
      if (me.login.form.name == '') {
        this.$notify.error({
          title: '错误',
          message: '名字不能为空哦~~'
        });
        return;
      }
      if (me.login.form.pw == '') {
        this.$notify.error({
          title: '错误',
          message: '不输入密码也想进入本网站？扯犊子~~'
        });
        return;
      }

      // 登录请求
      me.login_yes_done();
    },
    // 登录初始化
    login_yes_done() {
      var me = this;
      var params = new URLSearchParams();
      params.append('name', me.login.form.name);
      params.append('password', hex_md5(me.login.form.pw));
      me.$cchttp.post(me.$url.user.sign_in, params)
        .then(function(data) {
          // console.log(data);
          if (data.data.ret == -1) {
            me.$notify.error({
              title: '错误',
              message: data.data.info
            });
            me.login.form.pw = '';
            return;
          }
          me.login_sucsess(data.data);
        });
    },
    // 成功后的处理
    login_sucsess(data) {
      var me = this;
      // -------------------------------------显示和发出
      // 显示导航
      me.$store.dispatch('head_show');
      // 向导航发出数据
      me.$phone.$emit('top_nav_list', data);

      // -------------------------------------隐藏弹窗
      me.login.visible = false;

      // -------------------------------------session
      $.session.set('name', me.login.form.name);
      $.session.set('pw', me.login.form.pw);
      $.session.set('ps', data.powers);
      $.session.set('sn', data.sn);
    },


    // ------------------------------------------------------------------注册
    // 数据校验
    reg_yes() {
      var me = this;
      if (me.reg.form.name == '') {
        this.$notify.error({
          title: '错误',
          message: `${me.reg.form.name_label}不能为空~~`
        });
        return;
      }
      if (me.reg.form.pw == '') {
        this.$notify.error({
          title: '错误',
          message: `${me.reg.form.pw_label}不能为空~~`
        });
        return;
      }
      if (me.reg.form.sn == '') {
        this.$notify.error({
          title: '错误',
          message: `${me.reg.form.sn_label}不能为空~~`
        });
        return;
      }
      // 登录请求
      me.reg_yes_done();
    },
    // 校验成功
    reg_yes_done() {
      var me = this;
      var params = new URLSearchParams();
      params.append('name', me.reg.form.name);
      params.append('password', hex_md5(me.reg.form.pw));
      params.append('sn', me.reg.form.sn);
      me.$cchttp.post(me.$url.user.reg_in, params)
        .then(function(data) {
          me.reg_sucsess(data.data);
        });
    },
    reg_sucsess(data) {
      var me = this;
      // -------------------------------------显示和发出
      // 显示导航
      me.$store.dispatch('head_show');
      // 向导航发出数据
      me.$phone.$emit('top_nav_list', data);

      // -------------------------------------隐藏弹窗
      me.reg.visible = false;

      // -------------------------------------session
      $.session.set('name', me.reg.form.name);
      $.session.set('pw', me.reg.form.pw);
      $.session.set('ps', data.powers);
      $.session.set('sn', data.sn);
    },
    // ------------------------公共
    // 实时核查name是否重复
    check_name() {
      var me = this;
      if (me.reg.form.name == "") {
        return;
      }
      var params = new URLSearchParams();
      params.append('name', me.reg.form.name);
      me.$cchttp.post(me.$url.user.check_name, params)
        .then(function(data) {
          // console.log(data);
          if (data.data.ret == -1) {
            me.$notify.error({
              title: '错误',
              message: '已存在该用户名'
            });
            me.reg.form.name = '';
            return;
          }
        });
    },
    // 实时核查sn是否重复
    check_sn() {
      var me = this;
      if (me.reg.form.sn == "") {
        return;
      }
      var params = new URLSearchParams();
      params.append('sn', me.reg.form.sn);
      me.$cchttp.post(me.$url.dev.check_sn, params)
        .then(function(data) {
          // console.log(data);
          if (data.data.ret == -1) {
            me.$notify.error({
              title: '错误',
              message: '已存在该设备名'
            });
            me.reg.form.sn = '';
            return;
          }
        });
    },

    // ------------------------------------------------------------------游客模式
    vis_init() {
      var me = this;
      me.$notify.info({
        title: '您将进入超级管理员的游客模式',
        duration: me.vis.time,
      });
      setTimeout(function() {
        me.vis_login();
      }, me.vis.time)
    },
    // 登录
    vis_login() {
      var me = this;
      var params = new URLSearchParams();
      params.append('name', me.vis.name);
      params.append('password', hex_md5(me.vis.pw));
      me.$cchttp.post(me.$url.user.sign_in, params)
        .then(function(data) {
          // console.log(data);
          if (data.data.ret == -1) {
            me.$notify.error({
              title: '错误',
              message: data.data.info
            });
            return;
          }
          me.vis_login_sucsess(data.data);
        });
    },
    // 登录成功
    vis_login_sucsess(data) {
      var me = this;
      // -------------------------------------显示和发出
      // 显示导航
      me.$store.dispatch('head_show');
      // 向导航发出数据
      me.$phone.$emit('top_nav_list', data);

      // -------------------------------------session
      $.session.set('name', me.vis.name);
      $.session.set('pw', me.vis.pw);
      $.session.set('ps', data.powers);
      $.session.set('sn', data.sn);
      // ----------------------------------游客模式的唯一标识
      $.session.set('vis', true);
    }













  },
  watch: {},
  mounted() {
    var me = this;
    me.init();
  },
}
</script>
<!-- 导航菜单 -->
<style lang="less">
// login图标
@import '../css/login/style.css';
@import '../css/commom/main.less';
.vm_bg();
#vm_login {
  width: 100%;
  height: 100%;
  >.el-button {
    position: relative;
    left: 80%;
    top: 90%;
    transform: translate(-50%, -50%);
    background-color: @main_bgc;
  }
}
</style>
