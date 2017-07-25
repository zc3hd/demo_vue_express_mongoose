<template>
  <div id="users">
    <topHeader></topHeader>
    <!-- *********************************************搜索区********************************************* -->
    <el-row class="cc_row">
      <el-col :span="4">
        <el-input v-model="name" placeholder="请输入设备号" size="small"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" icon="search" size="small" @click="_search_by_sn">搜索</el-button>
      </el-col>
    </el-row>
    <!-- *********************************************表单********************************************* -->
    <!-- 按钮组 -->
    <el-row class="cc_row">
      <el-button type="primary" size="small" @click="add._visible = true">新增<i class="el-icon-plus el-icon--right"></i></el-button>
      <el-button type="success" size="small" @click="_edit_event">编辑<i class="el-icon-edit el-icon--right"></i></el-button>
      <el-button type="danger" size="small" @click="del_event">删除<i class="el-icon-delete el-icon--right"></i></el-button>
    </el-row>
    <!-- 表单本身 -->
    <el-row class="cc_row">
      <el-table class="cc_table" ref="multipleTable" :data="devs_list" border style="width: 100%" :height='table_height' @select="select">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="sn" label="设备号" width="120">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="120" :formatter="_state" sortable>
          <template scope="scope">
            <el-tag :color='scope.row.state | dev_state_color'>{{ scope.row.state | dev_state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lnglat" label="上线位置" width="350">
          <template scope="scope">
            <el-tag>{{ scope.row.lnglat}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="memo" label="备注" show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="page_change" :current-page="page.current" :page-size="page.size" layout="total, prev, pager, next" :total="page.total">
      </el-pagination>
    </el-row>
    <!-- *********************************************弹层*************************************** -->
    <!-- 新增弹窗 -->
    <el-dialog custom-class="dev_add" title="新增" :visible.sync="add._visible" :modal="false">
      <el-form :model="add._form">
        <el-form-item label="设备号" :label-width="add._lable_width">
          <el-input v-model="add._form.sn" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="add._lable_width">
          <el-input v-model="add._form.memo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上线位置" :label-width="add._lable_width">
          <el-button type="primary" size="small" @click="_add_loc">添加</el-button>
          <el-tag v-show="add_loc_data.lnglat">{{add_loc_data.lnglat}}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add._visible = false">取 消</el-button>
        <el-button type="primary" @click="_add_dev_event">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog custom-class="dev_add" title="编辑" :visible.sync="edit._visible" :modal="false">
      <el-form :model="edit._form">
        <el-form-item label="设备号" :label-width="edit._lable_width">
          <el-input v-model="edit._form.sn" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="edit._lable_width">
          <el-input v-model="edit._form.memo" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="上线位置" :label-width="edit._lable_width">
          <el-button type="primary" size="small" @click="_add_loc">修改</el-button>
          <el-tag>{{edit_loc_data.lnglat}}</el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="edit._visible = false">取 消</el-button>
        <el-button type="primary" @click="_edit_yes">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 位置弹窗 -->
    <el-dialog title="新增位置" :visible.sync="add_loc_data._visible" :modal="false" size='large'>
      <div id="map_loc">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="add_loc_data._visible = false">取 消</el-button>
        <el-button type="primary" @click="_add_loc_map_done">确 定</el-button>
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
      // ---------------------------输入框和列表
      sn: '',
      // 数据列表
      devs_list: [],
      // 用户选择到数据
      select_data: null,
      // height
      table_height: $(window).height() - 180,


      // ----------------------------新增
      add: {
        _visible: false,
        _lable_width: '80px',
        _form: {
          sn: '',
          memo: ""
        },
      },

      // ---------------------------新增位置
      add_loc_data: {
        _visible: false,
        lnglat: '',
      },



      // ----------------------------编辑
      edit: {
        _visible: false,
        // 标签的宽度
        _lable_width: '80px',
        _form: {
          sn: '',
          memo: ""
        },
      },

      edit_loc_data: {
        lnglat: '',
      },

      // ---------------------------翻页数据
      page: {
        // 当前页码
        current: 1,
        // 总数
        total: 0,
        // 页面显示量
        size: 11,
      },
      // ----------------------------信息提醒
      info: {
        time: 1500,
      },
      // -----------------------------设备所有的数据
      // 所有的marker-arr
      arr_sn: [],
    }
  },
  methods: {
    // ------------------------------------------------初始数据
    // 分页查询--加搜索查询
    _f_devs_by_page(sn) {
      var me = this;
      var params = new URLSearchParams();
      // 当前页码
      params.append('page', me.page.current);
      // 页面显示量
      params.append('size', me.page.size);
      // 空字符串--不传递数据了
      if (sn != '') {
        params.append('sn', sn);
      }
      return me.$cchttp.post(me.$url.dev.f_dev_by_page, params);
    },
    // 重新加载数据
    _all_devs_reload() {
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
        me._f_devs_by_page(me.sn)
          .then(function(all) {
            // 初始化用户列表
            me.devs_list = all.data.rows;
            // 搜索区不为空
            me.page.total = all.data.total;

          });
      }

    },
    // 设备状的处理
    _state(val) {
      if (val.state == false) return '未绑定';
      return "<span style = 'color:red'>已绑定</span>";
    },
    // -------------------------------------------------添加
    _add_dev_event() {
      var me = this;
      if (me.add._form.sn == '') {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '设备号不能为空'
        });
        return;
      }
      if (me.add_loc_data.lnglat == '') {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '请给设置添加一个上线位置'
        });
        return;
      }
      var params = new URLSearchParams();
      params.append('sn', me.add._form.sn);
      params.append('state', false);
      params.append('memo', me.add._form.memo);
      params.append('lnglat', JSON.stringify(me.add_loc_data.lnglat));

      // -----------------------------vis
      me.vis_param(params);


      me.$cchttp.post(me.$url.dev.dev_add, params)
        .then(function(data) {
          // -----------------------------vis
          if (data.data.ret == -1) {
            me.vis_info('新增设备');
          }

          // 已经存在该用户
          if (data.data.ret == 2) {
            me.add._form.sn = '';
            me.$message({
              type: 'warning',
              duration: me.info.time,
              message: '已经存在该设备！'
            });
            return;
          }
          // 数据重新加载
          me._all_devs_reload();
          me.add._form.sn = '';
          me.add._form.memo = "";
          me.add._visible = false;

          // 位置信息清除
          me.add_loc_data.lnglat = '';
        });
    },
    // 添加位置
    _add_loc() {
      var me = this;
      // 取位置的弹窗显示出来
      me.add_loc_data._visible = true;
      // 异步加载地图--因为dom是异步加载的--不要用异步--用$nextTick
      // setTimeout(function() {
      //   var map = me.map = new AMap.Map('map_loc', {
      //     mapStyle: 'amap://styles/graffiti',
      //     resizeEnable: true,
      //     zoom: 11,
      //     center: [116.397428, 39.90923]
      //   });
      //   console.log(map);
      // }, 0)

      me.$nextTick(function() {
        me._init_map();
      });
    },
    // 初始化地图
    _init_map() {
      var me = this;
      // 加载地图
      me.map = new AMap.Map('map_loc', {
        mapStyle: cc.map.style,
        resizeEnable: true,
        zoom: 11,
        center: [116.397428, 39.90923]
      });
      // 绑定设备打点
      me._bind_sn();
      me._bind_sn_list();
    },
    // 添加绑定的那个sn
    _bind_sn() {
      var me = this;
      var p_obj = null;
      // 添加
      if (me.add._visible) {
        p_obj = me.map.getCenter();
      }
      // 修改
      else {
        // 修改的时候就是选这个数据
        p_obj = JSON.parse(me.edit_loc_data.lnglat);
      }

      me.marker = new AMap.Marker({
        position: [p_obj.lng, p_obj.lat],
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true
      });
      me.marker.setMap(me.map);
      // 收集marker
      me.arr_sn.push(me.marker);
    },


    // -----------------------------------------打所有sn的点
    _bind_sn_list() {
      var me = this;
      // 没有数据
      me.$cchttp.post(me.$url.dev.f_devs_map)
        .then(function(data) {
          console.log(data.data);
          me._bind_draw_sn_list(data.data);
        });

    },
    // 具体的打点list
    _bind_draw_sn_list(arr) {
      var me = this;
      arr.forEach(function(item, index) {
        if (item.sn != me.edit._form.sn) {
          me._bind_draw_one(item);
        }
      });

      // 全部点打完成后进行最优视角
      me.map.setFitView(me.arr_sn);
    },
    // 具体的打点one
    _bind_draw_one(data) {
      var me = this;
      var p = JSON.parse(data.lnglat);
      var marker = new AMap.Marker({
        position: [p.lng, p.lat],
        offset: new AMap.Pixel(-cc.map.img_w / 2, -cc.map.img_h),
      });
      me._sn_label(marker, data);
      marker.setMap(me.map);

      // 收集marker
      me.arr_sn.push(marker);
    },
    // sn——label
    _sn_label(marker, data) {
      var me = this;
      var markerContent = document.createElement("div");
      markerContent.className = "marker";
      // 点标记中的图标
      var markerImg = document.createElement("img");
      markerImg.src = cc.map.img_src;
      markerContent.appendChild(markerImg);

      // 标记中的信息框
      var markerDIV = document.createElement("div");
      markerDIV.className = 'label';
      markerDIV.innerHTML = '<span class="info" id="devName">SN号：' + data.sn +
        '<br />' +
        '<span >state：' + (data.state ? '已绑定' : '未绑定') + '</span>' +
        '</span>' +
        '<div class="arrow"></div>';
      markerContent.appendChild(markerDIV);
      marker.setContent(markerContent); //更新点标记内容
    },


    // -----------------------------------------------------最后确认位置
    _add_loc_map_done() {
      var me = this;
      // 弹窗消失
      me.add_loc_data._visible = false;

      // 添加
      if (me.add._visible) {
        me.add_loc_data.lnglat = {
          lng: me.marker.getPosition().lng,
          lat: me.marker.getPosition().lat
        };
      }
      // 修改
      else {
        me.edit_loc_data.lnglat = {
          lng: me.marker.getPosition().lng,
          lat: me.marker.getPosition().lat
        };
      }


    },
    // -------------------------------------------------编辑
    // 表格选择到的数据
    select(selection, row) {
      this.select_data = selection;
    },

    // 弹出编辑框
    _edit_event() {
      var me = this;
      // none
      if ((me.select_data == null) || (me.select_data.length != 1)) {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '请选择一个设备'
        });
        return;
      }
      // 选择到一行数据
      else {
        // 显示弹窗
        me.edit._visible = true;
        // 改变信息
        me.edit._form.sn = me.select_data[0].sn;
        me.edit._form.memo = me.select_data[0].memo;

        // 位置信息
        me.edit_loc_data.lnglat = me.select_data[0].lnglat;
      }
    },
    // 确认修改
    _edit_yes() {
      var me = this;
      if (me.edit._form.sn == '') {
        me.$message({
          type: 'warning',
          duration: me.info.time,
          message: '设备号不能为空'
        });
        return;
      }
      var params = new URLSearchParams();
      params.append('_id', me.select_data[0]._id);
      params.append('sn', me.edit._form.sn);
      params.append('memo', me.edit._form.memo);
      params.append('lnglat', JSON.stringify(me.edit_loc_data.lnglat));

      // -----------------------------vis
      me.vis_param(params);

      me.$cchttp.post(me.$url.dev.dev_upd, params)
        .then(function(data) {

          // -----------------------------vis
          me.vis_info("修改设备");

          // 数据重新加载
          me._all_devs_reload();

          me.edit._form.sn = '';
          me.edit._form.memo = "";
          me.edit._visible = false;

          // 情况位置信息
          me.edit_loc_data.lnglat = '';
        });
    },



    // -------------------------------------------------删除
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
        me.$confirm('此操作删除该设备, 是否继续?', '提示', {
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

            me.$cchttp.post(me.$url.dev.dev_del, params)
              .then(function(data) {

                if (data.data.ret == -1) {
                  // -----------------------------vis
                  me.vis_info('删除设备');
                  return;
                }
                // 数据重新加载
                if (data.data.ret == 1) {
                  me._all_devs_reload();
                  me.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
                // 0
                else {
                  me.$message({
                    type: 'info',
                    message: '设备已被绑定，不能删除!'
                  });
                }

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
    // ------------------------------------------------搜索用户
    _search_by_sn() {
      var me = this;
      me._f_devs_by_page(me.name)
        .then(function(all) {
          me.devs_list = all.data.rows;
          // 用户总数
          me.page.total = all.data.total;
        });
    },
    // ------------------------------------------------初始化翻页数据
    // -------------------------------翻页函数
    page_change(val) {
      var me = this;
      me.page.current = val;
      me._all_devs_reload();
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
    this._all_devs_reload();
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
    >.dev_add {
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
    // 地图
    #map_loc {
      width: 100%;
      height: 360px;
      // background-color: red;
      // ----------地图上的marker
      .marker {
        position: relative;
        // 标注
        >.label {
          position: relative;
          color: #fff;
          background-color: rgba(238, 99, 99, 0.8);
          border-radius: 4px;
          padding: 5px 20px;
          min-width: 120px;
          z-index: 1000;
          /*面板的位置*/
          position: absolute;
          top: -41px;
          left: -49px;
          // 信息板面
          >.info {
            display: block;
            text-align: center;
            overflow: hidden;
            /*字体*/
            font: 12px arial, simsun, sans-serif;
            white-space: nowrap;
          }
          // 箭头
          >.arrow {
            position: absolute;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            bottom: -7px;
            left: 74px;
            margin-left: -5px;
            border-width: 8px 8px 0;
            border-top-color: rgba(238, 99, 99, 0.8);
          }
        }
      }
    }
  }
}
</style>
