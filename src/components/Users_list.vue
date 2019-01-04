<template>
  <div id="users">
    <topHeader></topHeader>
    <!-- *********************************************搜索区********************************************* -->
    <el-row class="cc_row">
      <el-col :span="4">
        <el-input v-model="name" placeholder="请输入姓名" size="small"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="search" size="small" @click="_search_by_name">搜索</el-button>
      </el-col>
    </el-row>
    <!-- *********************************************表单********************************************* -->
    <!-- 按钮组 -->
    <el-row class="cc_row">
      <el-button type="primary" size="small" @click="add._visible = true">新增<i class="el-icon-plus el-icon--right"></i></el-button>
      <el-button type="success" size="small" @click="_edit_event">编辑<i class="el-icon-edit el-icon--right"></i></el-button>
      <el-button type="danger" size="small" @click="del_event">删除<i class="el-icon-delete el-icon--right"></i></el-button>
      <el-button type="success" size="small" @click="dev_on">绑定<i class="el-icon-upload el-icon--right"></i></el-button>
      <el-button type="primary" size="small" @click="dev_off">解绑<i class="el-icon-circle-close el-icon--right"></i></el-button>
    </el-row>
    <!-- 表单本身 -->
    <el-row class="cc_row">
      <el-table class="cc_table" ref="multipleTable" :data="users_list" border style="width: 100%" :height='table_height' @select="select">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="sn" label="绑定设备" width="120" :formatter="sn_formatter">
        </el-table-column>
        <el-table-column prop="powers" label="权限" :formatter="ps_formatter" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="page_change" :current-page="page.current" :page-size="page.size" layout="total, prev, pager, next" :total="page.total">
      </el-pagination>
    </el-row>
    <!-- *********************************************弹层*************************************** -->
    <!-- 新增用户弹窗 -->
    <el-dialog custom-class="user_add" title="新增用户" :visible.sync="add._visible" :modal="false">
      <el-form :model="add._form">
        <el-form-item label="姓名" :label-width="add._lable_width">
          <el-input v-model="add._form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="add._lable_width">
          <el-checkbox-group v-model="add._form.powers">
            <el-checkbox v-for="(v,k) in all_ps_obj" :label="k" :key="k">{{v}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add._visible = false">取 消</el-button>
        <el-button type="primary" @click="_add_event">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户弹窗 -->
    <el-dialog custom-class="user_add" title="编辑用户" :visible.sync="edit._visible" :modal="false">
      <el-form :model="edit._form">
        <el-form-item label="姓名" :label-width="edit._lable_width">
          <el-input v-model="edit._form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="edit._lable_width">
          <el-checkbox-group v-model="edit._form.powers">
            <el-checkbox v-for="(v,k) in all_ps_obj" :label="k" :key="k">{{v}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit._visible = false">取 消</el-button>
        <el-button type="primary" @click="_edit_yes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 绑定设备的弹窗 -->
    <el-dialog custom-class="user_add" title="设备绑定" :visible.sync="dev._visible" :modal="false">
      <el-form :model="dev._form">
        <el-form-item label="设备号" :label-width="dev._lable_width">
          <el-input v-model="dev._form.sn" auto-complete="on" placeholder="请输入设备号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dev._visible = false">取消</el-button>
        <el-button type="primary" @click="dev_on_done">绑定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'users',
  // -----------------------配置
  data() {
    return {
      // ---------------------------输入框
      name: '',
      // ----------------------------新增用户
      add: {
        _visible: false,
        _lable_width: '50px',
        _form: {
          name: '',
          // 已经选择的权限
          powers: []
        },
      },
      // ----------------------------编辑用户
      edit: {
        _visible: false,
        // 标签的宽度
        _lable_width: '50px',
        _form: {
          name: '',
          // 已经选择的权限
          powers: []
        },
      },
      dev: {
        _visible: false,
        // 标签的宽度
        _lable_width: '100px',
        _form: {
          sn: '',
        },
      },
      // ----------------------------table
      table_height: $(window).height() - 180,
      users_list: [],
      // 用户选择到数据
      select_data: null,
      // 所有的权限数据
      all_ps_obj: {},
      // ---------------------------翻页数据
      page: {
        // 当前页码
        current: 1,
        // 总数
        total: 0,
        // 页面显示量
        size: 11,
      },
      // ---------------------------信息提示
      info: {
        time: 1500,
      },
      // ---------------------------游客模式
      vis: $.session.get('vis')
    }
  },
  methods: {
    // ------------------------------------------------初始数据
    // 拿到所有的权限
    _all_powers() {
      var me = this;
      return me.$cchttp.post(me.$url.power.find_all_power);
    },
    // 拿到的用户数据---开始用的这个，查询全部
    _all_users() {
      var me = this;
      return me.$cchttp.post(me.$url.user.find_all_users);
    },
    // 分页用户查询
    _all_users_by_page(name) {
      var me = this;
      var params = new URLSearchParams();
      // 当前页码
      params.append('page', me.page.current);
      // 页面显示量
      params.append('size', me.page.size);
      // 空字符串--不传递数据了
      if (name != '') {
        params.append('name', name);
      }
      return me.$cchttp.post(me.$url.user.find_users_by_page, params);
    },
    // 重新加载数据
    _all_users_reload() {
      var me = this;
      me._all_users_by_page(me.name)
        .then(function(all) {
          // 初始化用户列表
          me.users_list = all.data.rows;
          // 搜索区不为空
          me.page.total = all.data.total;

        });
    },
    // 同时拿到所有的数据
    _all_data() {
      var me = this;
      var name = $.session.get('name');
      // 无登录状态
      if (name == undefined) {
        // 隐藏导航
        me.$store.dispatch('head_hide');
        // 转跳login
        me.$Router.push({
          path: '/login'
        });
      }
      // 登录状态
      else {
        // 显示导航
        me.$store.dispatch('head_show');
        me.$cchttp.all([me._all_powers(), me._all_users_by_page(me.name)])
          .then(function(data) {
            me._data_handle(data);
          });
      }

    },
    _data_handle(arr) {
      var me = this;
      var ps = arr[0].data;
      var us = arr[1].data.rows;
      // 出初始化用户列表
      me.users_list = us;

      me.page.total = arr[1].data.total;
      me._data_handle_ps(ps);
    },
    // 处理返回的权限数据
    _data_handle_ps(arr) {
      var me = this;
      arr.forEach(function(val, index) {
        me.all_ps_obj[val.id] = val.name;
      });
    },
    // 每条数据渲染时，权限的处理
    ps_formatter(val) {
      var me = this;
      var arr = [];
      val.powers.forEach(function(element, index) {
        arr.push(me.all_ps_obj[element]);
      });
      return arr.join(' | ');
    },
    // 设备的处理
    sn_formatter(val) {
      if (val.sn == undefined || val.sn == '') return '未绑定设备';
      return val.sn;
    },
    // -------------------------------------------------添加用户
    _add_event() {
      var me = this;
      if (me.add._form.name == '') {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '用户姓名不能为空'
        });
        return;
      }
      var params = new URLSearchParams();
      params.append('name', me.add._form.name);
      params.append('password', hex_md5("123456"));
      params.append('powers', me.add._form.powers.join(','));

      // ----------------------------------游客模式
      me.vis_param(params);

      me.$cchttp.post(me.$url.user.user_add, params)
        .then(function(data) {
          // ----------------------------------游客模式
          me.vis_info('添加');
          // 数据重新加载
          me._all_users_reload();
          me.add._form.name = '';
          me.add._form.powers = [];
          me.add._visible = false;
        });
    },
    // -------------------------------------------------编辑用户
    // 表格选择到的数据
    select(selection, row) {
      this.select_data = selection;
    },
    // 点击选择用户--反选权限
    _edit_event() {
      var me = this;
      // none
      if ((me.select_data == null) || (me.select_data.length != 1)) {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '请选择一个用户'
        });
        return;
      }
      // 1
      else {
        // 显示弹窗
        me.edit._visible = true;
        // 改变信息
        me.edit._form.name = me.select_data[0].name;
        // 返回的数据为数字--需要转换为字符串数组
        me.select_data[0].powers.forEach(function(element, index) {
          me.select_data[0].powers[index] = element + "";
        });
        me.edit._form.powers = me.select_data[0].powers;
      }
    },
    _edit_yes() {
      var me = this;
      if (me.edit._form.name == '') {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '用户姓名不能为空'
        });
        return;
      }
      var params = new URLSearchParams();
      params.append('_id', me.select_data[0]._id);
      params.append('name', me.edit._form.name);
      params.append('powers', me.edit._form.powers.join(','));

      // ----------------------------------游客模式
      me.vis_param(params);

      me.$cchttp.post(me.$url.user.user_upd, params)
        .then(function(data) {

          // ----------------------------------游客模式
          me.vis_info('修改');

          // 数据重新加载
          me._all_users_reload();

          me.edit._form.name = '';
          me.edit._form.powers = [];
          me.edit._visible = false;
        });
    },
    // -------------------------------------------------删除用户
    del_event() {
      var me = this;
      // none
      if ((me.select_data == null) || (me.select_data.length != 1)) {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '请选择一个用户进行删除'
        });
        return;
      }
      // one
      else {
        me.$confirm('此操作删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          // done
          .then(() => {

            var params = new URLSearchParams();
            params.append('_id', me.select_data[0]._id);

            // -----------------------------vis
            me.vis_param(params);

            me.$cchttp.post(me.$url.user.user_del, params)
              .then(function(data) {

                // -----------------------------vis
                me.vis_info('删除');

                // 数据重新加载
                me._all_users_reload();

                me.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              });
          })
          // cancel
          .catch(() => {
            me.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      }
    },
    // -------------------------------------------------设备关联
    // 绑定设备
    dev_on() {
      var me = this;
      if ((me.select_data == null) || (me.select_data.length != 1)) {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '请选择一个用户进行绑定设备'
        });
        return;
      }
      me.dev._visible = true;
    },
    dev_on_done() {
      var me = this;
      if (me.dev._form.sn == "") {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '设备号不能为空！'
        });
        return;
      }
      var params = new URLSearchParams();
      params.append('_id', me.select_data[0]._id);
      params.append('sn', me.dev._form.sn);

      // -----------------------------vis
      me.vis_param(params);

      me.$cchttp.post(me.$url.user.user_on_sn, params)
        .then(function(data) {
          var ret = data.data.ret;


          // vis
          if (ret == -1) {
            // -----------------------------vis
            me.vis_info('关联');
            me.dev._visible = false;
            me.dev._form.sn = '';
          }
          // 没有设备
          else if (ret == 0) {
            me.$message({
              type: 'warning',
              duration: me.info.time,
              message: '设备列表没有该设备，请核查后再绑定~！'
            });
            me.dev._form.sn = ''
          }
          // 已结被绑定
          else if (ret == 2) {
            me.$message({
              type: 'warning',
              duration: me.info.time,
              message: '该设备已结被其他用户绑定~！'
            });
            me.dev._form.sn = ''
          }
          // 绑定成功
          else {
            // 数据重新加载
            me._all_users_reload();

            me.dev._visible = false;
            me.dev._form.sn = '';
          }

        });
    },
    // -------------------------------------------------设备解绑
    dev_off() {
      var me = this;
      if ((me.select_data == null) || (me.select_data.length != 1)) {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '请选择一个用户进行解绑'
        });
        return;
      }
      me.$confirm('此操作将解除绑定, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // done
        .then(() => {

          var params = new URLSearchParams();
          params.append('_id', me.select_data[0]._id);

          // -----------------------------vis
          me.vis_param(params);

          me.$cchttp.post(me.$url.user.user_off_sn, params)
            .then(function(data) {

              if (data.data.ret == -1) {
                // -----------------------------vis
                me.vis_info("解绑");
                return;
              }

              if (data.data.ret == 0) {
                me.$message({
                  type: 'info',
                  message: '用户没有绑定设备，你解绑个锤子~~~'
                });
                return;
              }
              // 数据重新加载
              me._all_users_reload();

              me.$message({
                type: 'success',
                message: '解除成功!'
              });
            });
        })
        // cancel
        .catch(() => {
          me.$message({
            type: 'info',
            message: '撤销解除'
          });
        });
    },
    // ------------------------------------------------搜索用户
    _search_by_name() {
      var me = this;
      me._all_users_by_page(me.name)
        .then(function(all) {
          me.users_list = all.data.rows;
          // 用户总数
          me.page.total = all.data.total;
        });
    },
    // ------------------------------------------------初始化翻页数据
    // -------------------------------翻页函数
    page_change(val) {
      var me = this;
      me.page.current = val;
      me._all_users_reload();
    },

    // --------------------------------------------------游客模式
    // 传参
    vis_param(params) {
      var me = this;
      if (me.vis) {
        return params.append('vis', me.vis);
      }
    },
    vis_info(str) {
      var me = this;
      if (me.vis) {
        me.$notify.info({
          title: '游客模式没有' + str + '权限',
        });
      }
    },

  },

  // -------------------------------------周期
  beforeCreate() {},
  mounted() {
    $("#users").niceScroll({
      cursorwidth: 12,
      cursoropacitymin: 0.4,
      cursorcolor: '#6e8cb6',
      cursorborder: 'none',
      cursorborderradius: 4,
      autohidemode: 'leave'
    });
    // 初始化全部数据
    this._all_data();
  },
  beforeDestroy: function() {},
  // ---------------------组件注册
  components: {},
}
</script>
<style lang="less">
// 这里不能把属性设置为私有
@import '../css/commom/main.less';
// #app {
//   >.main_cont {
//     background-color: @main_bgc;
//     width: 84%;
//   }
// }
#users {
  height: 100%;
  box-sizing: border-box;
  // padding-top: @header_h+10px;
  // padding-top: 10px;
  // position: relative;
  background-color: transparent;
  overflow-x: auto;
  >.cc_row {
    padding-left: 30px;
    padding-right: 50px;
    padding-bottom: 5px;
    // ----------------------头部搜索区
    .el-input__inner {
      background-color: transparent;
      color: white;
    }
    // 搜索框的样式
    >.el-col {
      padding-right: 10px;
    }
    // ----------------------表格
    >.el-table {
      background-color: transparent;
      // 表身
      tr {
        background-color: transparent;
        color: @font_color;
      }
      tr:hover {
        >td {
          background-color: rgba(0, 0, 0, 0.6);
          color: @font_color;
        }
      }
      // 表头
      th {
        background-color: transparent;
      }
      thead div {
        background-color: transparent;
        color: @font_color;
      }
    }
    // -----------------------分页
    >.el-pagination {
      >span {
        color: white;
      }
      // 前后按钮
      >button {
        background-color: transparent;
        color: white;
      }
      >ul {
        >li {
          background-color: transparent;
          color: white;
        }
        >li.active {
          background-color: #20a0ff;
          color: white;
        }
      }
    }
  }
  // 弹出框
  >.el-dialog__wrapper {
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
}
</style>
