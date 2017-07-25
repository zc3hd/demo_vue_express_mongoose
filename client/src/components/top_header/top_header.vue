<template>
  <el-row class="cc_row header_row">
    <el-dropdown @command="_sel">
      <span class="el-dropdown-link">
        {{name}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
      <el-dropdown-menu slot="dropdown" class="header-dropdown-menu">
        <el-dropdown-item command="1">修改密码</el-dropdown-item>
        <el-dropdown-item command="2">退出登陆</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码 -->
    <el-dialog custom-class="user_add" title="修改密码" :visible.sync="upd_pw._visible" :modal="false">
      <el-form :model="upd_pw._form">
        <el-form-item label="旧密码" :label-width="upd_pw._lable_width">
          <el-input v-model="upd_pw._form.old" auto-complete="off" class='header_ipt' type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="upd_pw._lable_width">
          <el-input v-model="upd_pw._form.new" auto-complete="off" class='header_ipt' type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upd_pw._visible = false">取 消</el-button>
        <el-button type="primary" @click="upd_pw_e">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  data() {
      return {
        name: $.session.get('name'),
        // ----------------------------修改密码
        upd_pw: {
          _visible: false,
          _lable_width: '100px',
          _form: {
            old: '',
            new: "",
          },
        },
        // ---------------------------信息提示
        info: {
          time: 1500,
        }
      }
    },
    methods: {
      _sel(val) {
        var me = this;
        // 修改密码
        if (val == 1) {
          me.upd_pw._visible = true;
        }
        // 退出登陆
        else if (val == 2) {
          me._login_out();
        }
        // 意见留言
        else if (val == 3) {
          console.log(val);
        }
      },
      // -------------确认修改
      upd_pw_e() {
        var me = this;
        if (me.upd_pw._form.old == '') {
          me.$message({
            type: 'warning',
            duration: me.info.time,
            message: '请输入旧密码！'
          });
          return;
        }
        if (me.upd_pw._form.new == '') {
          me.$message({
            type: 'warning',
            duration: me.info.time,
            message: '请输入新密码！'
          });
          return;
        }
        me.upd_pw_done();
      },
      upd_pw_done() {
        var me = this;
        var params = new URLSearchParams();
        params.append('name', $.session.get('name'));
        params.append('old', hex_md5(me.upd_pw._form.old));
        params.append('new', hex_md5(me.upd_pw._form.new));

        // -----------------------------vis
        me.vis_param(params);


        me.$cchttp.post(me.$url.user.user_upd_pw, params)
          .then(function(data) {
            if (data.data.ret == -1) {
              // -----------------------------vis
              me.vis_info('修改密码');
              me.upd_pw._visible = false;
              // 数据重置
              me.upd_pw._form.old = '';
              me.upd_pw._form.new = '';
              return;
            }
            // 修改错误
            if (data.data.ret == 0) {
              me.$message({
                type: 'warning',
                duration: me.info.time,
                message: data.data.info,
              });
              me.upd_pw._form.old = '';
              return;
            }
            // ------------------------修改成功
            me.upd_pw._visible = false;
            // 重新设置下session
            $.session.set('pw', me.upd_pw._form.new);
            // 数据重置
            me.upd_pw._form.old = '';
            me.upd_pw._form.new = '';
            // 弹窗提醒
            me.$message({
              type: 'success',
              duration: me.info.time,
              message: "修改密码成功",
            });

          })
      },
      // -------------退出登陆
      _login_out() {
        var me = this;
        this.$confirm('此操作将退出当前登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          // 确认
          .then(() => {
            // ----------------info
            me.$message({
              type: 'success',
              message: '退出成功!'
            });
            // ----------------session
            $.session.clear();
            // ---------------路由转跳到login
            me.$Router.push({
              path: '/login'
            });

          })
          // 取消
          .catch(() => {
            me.$message({
              type: 'info',
              message: '已取消退出'
            });
          });
      },

      // --------------------------------------------------游客模式
      // 传参
      vis_param(params) {
        if ($.session.get('vis')) {
          return params.append('vis', $.session.get('vis'));
        }
      },
      vis_info(str) {
        var me = this;
        if ($.session.get('vis')) {
          me.$notify.info({
            title: '游客模式没有' + str + '权限',
          });
        }
      },

    },
    // -------------------------------------周期
    beforeCreate() {},
    mounted() {},
    beforeDestroy: function() {},
}
</script>
<style lang="less">
.header_row {
  padding: 0;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  >.el-dropdown {
    float: right;
    color: white;
    font-size: 14px;
  }
}

// 
.header-dropdown-menu {
  box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.8);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 14px;
}

@import '../../css/commom/main.less';
// 弹出框
.el-dialog__wrapper {
  // 新增用户的弹窗样式
  >.user_add {
    width: 40%;
    // 头部
    >.el-dialog__header {
      >.el-dialog__title {
        color: @font_color;
      }
      background-color: @other_bgc;
      color: @font_color;
    }
    >.el-dialog__body {
      padding: 20px;
      padding-bottom: 0px;
      .el-form-item {
        width: 100%;
        display: block;
        margin-bottom: 5px;
      }
    }
  }
}

// 弹出框输入框样式
#users > .header_row .header_ipt>.el-input__inner {
  background-color: transparent;
  color: #000;
}
</style>
