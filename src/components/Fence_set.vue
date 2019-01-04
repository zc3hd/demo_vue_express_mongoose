<template>
  <div id="maps">
    <topHeader></topHeader>
    <!-- *********************************************地图区********************************************* -->
    <div id="main_contain_map">
      <!-- 地图 -->
      <div style="width:100%;height:100%;" id="map"></div>
      <!-- 按钮 -->
      <div>
        <span class="p_btn" id="f_opt" v-show='btn.add' @click="_edit_add">新增围栏</span>
        <span class="p_btn p_btn_1" id="f_opt_save" v-show='btn.upd' @click="_edit_upd">保存围栏</span>
        <span class="p_btn p_btn_1" id="f_opt_del" v-show='btn.del' @click='_edit_del'>删除围栏</span>
      </div>
      <!-- *********************************************弹窗区********************************************* -->
      <!-- 编辑围栏 -->
      <el-dialog custom-class="user_add" title="编辑围栏" :visible.sync="upd._visible" :modal="false">
        <el-form :model="upd._form">
          <el-form-item label="围栏名称" :label-width="upd._lable_width">
            <el-input v-model="upd._form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="报警类型" :label-width="upd._lable_width">
            <el-radio class="radio" v-model="upd._form.alarm" label="0">出围栏报警</el-radio>
            <el-radio class="radio" v-model="upd._form.alarm" label="1">进围栏报警</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="upd._visible = false">取 消</el-button>
          <el-button type="primary" @click="_edit_upd_done">保 存</el-button>
        </div>
      </el-dialog>
      <!-- 新增围栏 -->
      <el-dialog custom-class="user_add" title="新增围栏" :visible.sync="add._visible" :modal="false">
        <el-form :model="add._form">
          <el-form-item label="围栏名称" :label-width="add._lable_width">
            <el-input v-model="add._form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="报警类型" :label-width="add._lable_width">
            <el-radio class="radio" v-model="add._form.alarm" label="0">出围栏报警</el-radio>
            <el-radio class="radio" v-model="add._form.alarm" label="1">进围栏报警</el-radio>
          </el-form-item>
          <el-form-item label="围栏类型" :label-width="add._lable_width">
            <el-radio class="radio" v-model="add._form.type" label="0">圆型</el-radio>
            <el-radio class="radio" v-model="add._form.type" label="2">多边形</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="add._visible = false">取 消</el-button>
          <el-button type="primary" @click="_edit_add_done">保 存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  name: 'maps',
  // -----------------------配置
  data() {
    return {
      btn: {
        add: true,
        upd: false,
        del: false
      },
      // 修改
      upd: {
        _visible: false,
        _lable_width: '100px',
        _form: {
          name: '',
          alarm: 0
        },
      },
      // 新增
      add: {
        _visible: false,
        _lable_width: '100px',
        _form: {
          name: '',
          alarm: "0",
          type: '0'
        },
      },
    }
  },
  methods: {
    init: function(id) {
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

        me.id = id;
        // 初始化父级样式
        me._init_style();
        //开启控件
        me.init_Baner();
        setTimeout(function() {
          me.init_event();
        }, 500);
      }

    },
    // 初始化父级样式
    _init_style() {
      this.$el.lastElementChild.style.height = this.$el.offsetHeight - this.$el.firstElementChild.offsetHeight + 'px';
      this.$el.firstElementChild.style.marginBottom = 0;
    },
    //控件默认初始化
    init_Baner: function() {
      var me = this;
      var map = me.map = new AMap.Map(me.id, {
        mapStyle: cc.map.style,
        // features:[]
      });
      map.setZoomAndCenter(11, [116.404, 39.915]);
    },
    init_event: function() {
      var me = this;
      me.init_data();
      me.fence();
    },
    init_data: function() {
      this.sn = "";
      // 鼠标操作工具
      this.mouse_tools = null;
      // 围栏的默认样式
      this.styleOptions = {
        strokeColor: "#C0FF3E", //边线颜色。
        fillColor: "#C0FF3E", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.1, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      };
      // 编辑围栏的样式
      this.editOptions = {
        strokeColor: "red", //边线颜色。
        fillColor: "red", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.8, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      };
      // 点击的当前围栏
      this.active_f = null;
    },
    fence: function() {
      var me = this;
      me.f_check();
    },
    f_check: function() {
      var me = this;
      var sn = $.session.get('sn');
      // 没有绑定设备
      if (sn == undefined) {
        // 在自己的路径下
        if (me.$route.path == '/fence_manage') {
          me.$notify.error({
            title: '请绑定设备后，再设置围栏',
            message: ""
          });
          return;
        }

      }
      // 绑定设备了
      else {
        me.sn = sn;
        var params = new URLSearchParams();
        params.append('sn', me.sn);
        // 设备打点
        me.$cchttp.post(me.$url.dev.dev_f_one, params)
          .then(function(data) {
            // 记录sn的数据
            me.sn_obj = data.data;
            me.f_sn(data.data.lnglat);
          });
        me.$notify.success({
          title: '请为' + sn + '设备设置围栏~~',
          message: ''
        });
        me.f_init();
      }
    },
    // --------------------初始化设备位置
    f_sn: function(data) {
      var me = this;

      var p = JSON.parse(data);
      // 保存下拿回来的数据
      me.loc_data = data;

      me.map.setZoomAndCenter(16, [p.lng, p.lat]);
      // 
      var marker = new AMap.Marker({
        position: [p.lng, p.lat],
        offset: new AMap.Pixel(-cc.map.img_w / 2, -cc.map.img_h),
      });
      me.f_sn_label(marker);
      marker.setMap(me.map);
    },
    f_sn_label: function(marker) {
      var me = this;
      // 自定义点标记内容
      var markerContent = document.createElement("div");
      markerContent.className = "marker";
      // 点标记中的图标
      var markerImg = document.createElement("img");
      markerImg.src = cc.map.img_src;
      markerContent.appendChild(markerImg);

      // 标记中的信息框
      var markerDIV = document.createElement("div");
      markerDIV.className = 'label';
      markerDIV.innerHTML = '<span class="info" id="devName">SN号：' + me.sn_obj.sn +
        '<br />' +
        '<span >memo：' + me.sn_obj.memo + '</span>' +
        '<br />' +
        '<span >state：' + (me.sn_obj.state ? '已绑定' : '未绑定') + '</span>' +
        '</span>' +
        '<div class="arrow"></div>';
      markerContent.appendChild(markerDIV);

      marker.setContent(markerContent); //更新点标记内容
    },
    f_init: function() {
      var me = this;
      // me._add();
      me._tool();
      me._show();
    },
    // *-----------------------------------------------tool
    _tool: function() {
      var me = this;
      me.map.plugin(["AMap.MouseTool"], function() {
        me.mouse_tools = new AMap.MouseTool(me.map);
        me._tool_done();
      });
    },
    // 绘画完成
    _tool_done: function() {
      var me = this;
      me.mouse_tools.on('draw', function(data) {
        me.mouse_tools.close();
        me.map.setDefaultCursor("pointer");

        var dom = data.obj;

        dom.name = me.add._form.name;
        // 形状
        dom.type = me.add._form.type;
        // 报警类型
        dom.alarm = me.add._form.alarm;

        me._tool_done_data_celect(dom);
      });
    },
    // 绘画完成++收集数据
    _tool_done_data_celect: function(marker) {
      var me = this;
      var params = new URLSearchParams();
      params.append('sn', me.sn);
      params.append('name', me.add._form.name);
      params.append('alarm', me.add._form.alarm * 1);
      params.append('type', me.add._form.type * 1);
      // 圆形数据
      if (marker.type == 0) {
        params.append('center', JSON.stringify([marker.getCenter().lng, marker.getCenter().lat]));
        params.append('radius', parseInt(marker.getRadius()));
      }
      // duo
      else if (marker.type == 2) {
        var p_arr = marker.getPath();
        var region = [];
        for (var j = 0; j < p_arr.length; j++) {
          region.push({
            lng: p_arr[j].lng,
            lat: p_arr[j].lat
          });
        }
        params.append('region', JSON.stringify(region));
      }

      me._tool_done_data_ajax(params);

    },
    _tool_done_data_ajax: function(params) {
      var me = this;
      me.$cchttp.post(me.$url.fence.f_add, params)
        .then(function(data) {

          // 清空容器
          me.active_f = null;
          // 弹窗
          me.add._visible = false;
          // 回复数据
          me.add._form.name = '';
          me.add._form.alarm = "0";
          me.add._form.type = "0";

          // 显示
          me._show();
        });
    },
    // -------------------------------------------------显示
    _show: function() {
      var me = this;
      var params = new URLSearchParams();
      params.append('sn', me.sn);
      me.$cchttp.post(me.$url.fence.f_all_fence, params)
        .then(function(data_f) {
          var items = data_f.data;
          me.map.clearMap();
          // 展示设备点
          me.f_sn(me.loc_data);

          // 围栏数据
          if (items.length == 0) {
            me.$notify({
              title: '该设备没有设置围栏',
              message: '',
              type: 'warning'
            });
            return;
          }
          items.forEach(function(item) {
            // 圆形
            if (item.type == 0) {
              me._show_yuan(item);
            }
            // 多边形
            else if (item.type == 2) {
              me._show_duo(item);
            }
          });
          // 展示的显示和编辑
          me._show_e();


        });
    },
    // 圆形展示
    _show_yuan: function(data) {
      var me = this;

      var _center = JSON.parse(data.center);
      var center = new AMap.LngLat(_center[0], _center[1])


      var opts = {};
      for (var key in me.styleOptions) {
        opts[key] = me.styleOptions[key]
      }
      opts.map = me.map;
      opts.center = center;
      opts.radius = data.radius;

      var marker = new AMap.Circle(opts);

      // 绑定属性
      marker._id = data._id;
      marker.name = data.name;
      marker.alarm = data.alarm;
      marker.type = data.type;
    },
    // 多边形
    _show_duo: function(data) {
      var me = this;
      // console.log(data);
      data.region = JSON.parse(data.region);
      var path = [];
      for (var i = 0; i < data.region.length; i++) {
        var p = data.region[i];
        path.push(new AMap.LngLat(p.lng, p.lat));
      }

      var opts = {};
      for (var key in me.styleOptions) {
        opts[key] = me.styleOptions[key]
      }
      opts.map = me.map;
      opts.path = path;

      var marker = new AMap.Polygon(opts);

      marker._id = data._id;
      marker.name = data.name;
      marker.alarm = data.alarm;
      marker.type = data.type;
    },
    _show_e: function() {
      var me = this;
      var all_f = me.map.getAllOverlays();
      // 显示信息事件
      me._mouseover(all_f);
      // 所有围栏的点击事件
      me._click(all_f);
    },
    // -----------------------------------------------------------显示功能
    _mouseover: function(arr) {
      var me = this;
      for (var i = 0; i < arr.length; i++) {
        arr[i].off('mouseover');
        arr[i].on('mouseover', function(e) {

          if (!e.target.alarm) {
            return;
          }

          e.target.indexLayer = me.$message({
            showClose: false,
            duration: 0,
            message: `围栏名称：${e.target.name}；报警条件：${e.target.alarm == 0 ? '出围栏报警' : '入围栏报警'}`
          });

        });
        arr[i].off('mouseout');
        arr[i].on('mouseout', function(e) {
          if (!e.target.alarm) {
            return;
          }
          e.target.indexLayer.close();
        });
      }
    },
    // -----------------------------------------------------------编辑功能
    _click: function(arr) {
      var me = this;
      for (var i = 0; i < arr.length; i++) {
        arr[i].off('click');
        arr[i].on('click', function(e) {

          if (!e.target.alarm) {
            return;
          }
          // 没有记录点击的围栏
          if (me.active_f == null) {
            // 收集当前围栏
            me.active_f = e.target;
            // 编辑功能
            me._edit(e.target);
          }
          // 记录点击的围栏
          else {
            me.$notify({
              title: '警告',
              message: '请完成围栏编辑，在进行其他操作！',
              type: 'warning'
            });
          }
        });
      }
    },
    // 编辑围栏
    _edit: function(dom) {
      /* body... */
      var me = this;
      // 编辑删除按钮显示
      me.btn.add = false;
      me.btn.upd = true;
      me.btn.del = true;


      // yuan
      if (dom.type == 0) {
        me._edit_mode("AMap.CircleEditor", dom);
      }
      // duo
      else if (dom.type == 2) {
        me._edit_mode("AMap.PolyEditor", dom);
      }
    },
    _edit_mode: function(mode, dom) {
      var me = this;
      me.map.plugin([mode], function() {
        // yuan
        if (dom.type == 0) {
          me.mode = new AMap.CircleEditor(me.map, dom);
        }
        // duo
        else if (dom.type == 2) {
          me.mode = new AMap.PolyEditor(me.map, dom);
        }
        // 开启编辑模式
        me.mode.open();
        // 编辑的样式
        dom.setOptions(me.editOptions);

      });
    },
    // -----------------------------------------------------------更新围栏
    _edit_upd: function() {
      var me = this;
      var dom = me.active_f;
      // 显示表格
      me.upd._visible = true;
      me.upd._form.name = dom.name;
      me.upd._form.alarm = dom.alarm + "";
    },
    // 确认保存
    _edit_upd_done: function() {
      /* body... */
      var me = this;
      var marker = me.active_f;
      if (me.upd._form.name == '') {
        me.$notify({
          title: '警告',
          message: '围栏名称不能为空',
          type: 'warning'
        });
        return;
      }

      // 收集数据
      var params = new URLSearchParams();
      params.append('_id', marker._id);
      params.append('name', me.upd._form.name);
      params.append('alarm', me.upd._form.alarm * 1);
      params.append('type', marker.type * 1);
      // 圆形数据
      if (marker.type == 0) {
        params.append('center', JSON.stringify([marker.getCenter().lng, marker.getCenter().lat]));
        params.append('radius', parseInt(marker.getRadius()));

      }
      // duo
      else if (marker.type == 2) {
        var p_arr = marker.getPath();
        var region = [];
        for (var j = 0; j < p_arr.length; j++) {
          region.push({
            lng: p_arr[j].lng,
            lat: p_arr[j].lat
          });
        }
        params.append('region', JSON.stringify(region));
      }
      // -----------------------------------------确认编辑
      me._edit_done_ajax(marker, params);
    },
    // 确认保存的ajax
    _edit_done_ajax: function(marker, params) {
      var me = this;

      me.$cchttp.post(me.$url.fence.f_upd, params)
        .then(function(data) {
          // dom关闭模式
          me.mode.close();
          marker.setOptions(me.styleOptions);
          // 清空容器
          me.active_f = null;

          // 弹窗和按钮的显示
          me.btn.add = true;
          me.btn.upd = false;
          me.btn.del = false;
          me.upd._visible = false;


          me._show();
          // me._add();
        });
    },

    // -----------------------------------------------------------删除围栏
    _edit_del: function() {
      var me = this;
      me.$confirm('此操作将删除该围栏, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // done
        .then(() => {

          var params = new URLSearchParams();
          params.append('_id', me.active_f._id);

          me.$cchttp.post(me.$url.fence.f_del, params)
            .then(function(data) {
              // 清空容器
              me.active_f = null;
              // 按钮的显示
              me.btn.add = true;
              me.btn.upd = false;
              me.btn.del = false;

              me._show();
              // me._add();

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
    },

    // *------------------------------------------------添加
    _edit_add: function() {
      var me = this;
      me.add._visible = true;
    },
    // 新增数据收集
    _edit_add_done: function() {
      var me = this;

      if (me.add._form.name == '') {
        me.$notify({
          title: '警告',
          message: '围栏名称不能为空',
          type: 'warning'
        });
        return;
      }

      var type = me.add._form.type
        // 圆形
      if (type == 0) {
        me.f_add_yuan();
      }
      // 多边形
      else if (type == 2) {
        me.$notify({
          title: '警告',
          message: '多边形围栏结束绘画请双击鼠标~~',
          type: 'info'
        });
        me.f_add_duo();
      }
      me.add._visible = false;

    },
    // 添加圆形
    f_add_yuan: function() {
      // body... 
      var me = this;
      me.map.setDefaultCursor("crosshair");
      me.mouse_tools.circle(me.styleOptions);
    },
    // 添加多边形
    f_add_duo: function(argument) {
      var me = this;
      me.map.setDefaultCursor("crosshair");
      me.mouse_tools.polygon(me.styleOptions);
    },

    
  },

  // -------------------------------------周期
  beforeCreate() {},
  mounted() {
    $("#maps").niceScroll({
      cursorwidth: 12,
      cursoropacitymin: 0.4,
      cursorcolor: '#6e8cb6',
      cursorborder: 'none',
      cursorborderradius: 4,
      autohidemode: 'leave'
    });
    this.init('main_contain_map');
  },
  beforeDestroy: function() {},
  // ---------------------组件注册
  components: {},
}
</script>
<style lang="less">
// 这里不能把属性设置为私有
@import '../css/commom/main.less';
#maps {
  height: 100%;
  box-sizing: border-box;
  // padding-top: @header_h+10px;
  // position: relative;
  background-color: transparent;
  overflow-x: auto;
  >#main_contain_map {
    position: relative;
    // 按钮
    .p_btn {
      position: absolute;
      top: 10px;
      left: 10px;
      height: 20px;
      border: 2px solid rgb(33, 83, 109);
      background-color: rbga(0, 0, 0, 0.5);
      color: #fff;
      z-index: 10;
      cursor: pointer;
      line-height: 20px;
      text-align: center;
      padding-left: 8px;
      padding-right: 8px;
      font-size: 10px;
    }
    // 删除按钮
    #f_opt_del {
      // display: none;
      left: 92px;
    }
    // 地图上的marker
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
        top: -57px;
        left: -68px;
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
          left: 92px;
          margin-left: -5px;
          border-width: 8px 8px 0;
          border-top-color: rgba(238, 99, 99, 0.8);
        }
      }
    }
  }
}
</style>
