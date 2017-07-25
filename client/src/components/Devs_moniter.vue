<template>
  <div id="moniter">
    <topHeader></topHeader>
    <!-- *********************************************地图区********************************************* -->
    <div id="main_contain_map">
      <!-- 地图 -->
      <div style="width:100%;height:100%;" id="map"></div>
      <!-- 按钮 -->
      <div>
        <span class="p_btn" @click="_fences">{{btn.fence}}</span>
        <span class="p_btn" id="btn_moniter" v-show='btn.moniter_show' @click="_trail">{{btn.moniter}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'moniter',
  // -----------------------配置
  data() {
    return {
      // ---------------------------------------sn
      // 收集marker
      pt: null,
      // 监控timer
      timer: null,
      // 开关
      trail_key: true,

      // --------------------------------------fence
      // 围栏的样式
      fence_st: {
        strokeColor: "#C0FF3E", //边线颜色。
        fillColor: "#C0FF3E", //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 1, //边线的宽度，以像素为单位。
        strokeOpacity: 0.5, //边线透明度，取值范围0 - 1。
        fillOpacity: 0.5, //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
      },
      // 围栏的收集
      fence_arr: [],
      // 是否显示围栏
      fence_key: false,
      // --------------------------------------btn
      btn: {
        fence: '显示围栏',
        moniter: '开始追踪',
        moniter_show: false
      },
      // ---------------------------------------追踪
      // 追踪线的样式
      line: {
        strokeColor: "#C0FF3E", //线颜色
        strokeOpacity: 0.5, //线透明度
        strokeWeight: 5, //线宽
        strokeStyle: "dashed", //线样式
        strokeDasharray: [10, 5] //补充线样式
      },
      // 线的点的收集
      line_arr: [],
      // 追踪形成的线的收集
      polyline_arr: [],
      // 是否开启追踪
      trail_key: false,
      // 
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
      });
      map.setZoomAndCenter(11, [116.404, 39.915]);
    },
    init_event: function() {
      var me = this;
      me._sn_init();
    },
    // 获取单个设备的数据
    _sn_init() {
      var me = this;
      var sn = me.sn = $.session.get('sn');
      if (!sn) {
        this.$notify.error({
          title: '错误',
          message: '该用户没有绑定设备~~'
        });
        return;
      }
      // 设备定位
      me._pc_loc();
    },
    // ------------------------------------------围栏
    _fences() {
      var me = this;
      // 进行显示
      if (!me.fence_key) {
        me.fence_key = true;
        me.btn.fence = '隐藏围栏';
        if (me.fence_arr.length) {
          me.fence_arr.forEach(function(element, index) {
            element.setMap(me.map);
          });
          return
        }
        var params = new URLSearchParams();
        params.append('sn', me.sn);
        me.$cchttp.post(me.$url.fence.f_all_fence, params)
          .then(function(data_f) {
            var items = data_f.data;
            // 围栏数据
            me._show_fence(items);
          });
      }
      // 隐藏围栏
      else {
        me.btn.fence = '显示围栏';
        me.fence_key = false;
        me._hide_fence();
      }
    },
    // 隐藏围栏
    _hide_fence() {
      var me = this;
      me.fence_arr.forEach(function(element, index) {
        element.setMap(null);
      });
    },
    _show_fence(items) {
      var me = this;
      if (items.length == 0) {
        me.$notify({
          title: '该设备没有设置围栏',
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
      me._show_e();
    },
    // 圆形展示
    _show_yuan: function(data) {
      var me = this;

      var _center = JSON.parse(data.center);
      var center = new AMap.LngLat(_center[0], _center[1])


      var opts = {};
      for (var key in me.fence_st) {
        opts[key] = me.fence_st[key]
      }
      opts.map = me.map;
      opts.center = center;
      opts.radius = data.radius;

      var marker = new AMap.Circle(opts);
      me.fence_arr.push(marker);

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
      for (var key in me.fence_st) {
        opts[key] = me.fence_st[key]
      }
      opts.map = me.map;
      opts.path = path;

      var marker = new AMap.Polygon(opts);
      me.fence_arr.push(marker);

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
    },
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
    // ---------------------------------pc定位
    _pc_loc() {
      var me = this;
      me.map.plugin('AMap.Geolocation', function() {
        // 定位器
        me.geo = new AMap.Geolocation({
          //是否使用高精度定位，默认:true
          enableHighAccuracy: true,
          //超过10秒后停止定位，默认：无穷大
          timeout: 10000,
          showButton: false,
          //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20),
          // 显示marker
          showMarker: false,
          //定位成功后用圆圈表示定位精度范围，默认：true
          showCircle: true,
          //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: true,
          // 
          buttonPosition: 'RB'
        });
        // 添加按钮
        me.map.addControl(me.geo);
        // 开始定位
        me._pc_loc_start();
      });
    },
    // 开始定位
    _pc_loc_start() {
      var me = this;
      // 信息面板
      me.$notify({
        title: '开始定位...',
        type: 'success',
      });

      setTimeout(function() {
        me.geo.getCurrentPosition();
      }, 3000);
      //返回定位信息
      AMap.event.addListener(me.geo, 'complete', me._pc_loc_done);
      //返回定位出错信息
      AMap.event.addListener(me.geo, 'error', me._pc_loc_fail);
    },
    //解析定位结果
    _pc_loc_done(data) {
      var me = this;
      var params = new URLSearchParams();
      params.append('sn', me.sn);
      params.append('lnglat', JSON.stringify({
        lng: data.position.lng,
        lat: data.position.lat
      }));
      // 跟新坐标
      me.$cchttp.post(me.$url.dev.dev_upd_pos, params)
        .then(function(dev) {
          me.$notify({
            title: `当前地址：${data.formattedAddress}`,
            type: 'success',
          });
          // 追踪按钮显示
          me.btn.moniter_show = true;
          me._draw_one(dev.data);
        });
    },
    // 定位失败
    _pc_loc_fail(data) {
      var me = this;
      me.$notify({
        title: '定位失败',
        message: '3秒后进行系统默认定位',
        type: 'error',
      });
      setTimeout(function() {
        var params = new URLSearchParams();
        params.append('sn', sn);
        me.$cchttp.post(me.$url.dev.dev_f_one, params)
          .then(function(data) {
            // 追踪按钮显示
            me.btn.moniter_show = true;
            me._draw_one(data.data);
          });
      }, 3000);
    },
    // -------------------------------------------------------------------设备追踪
    // 请求数据
    _trail() {
      var me = this;
      // 开启追踪
      if (!me.trail_key) {
        me.trail_key = true;
        me.btn.moniter = '退出追踪';
        me._trail_start();
      }
      // 停止追踪
      else {
        me.trail_key = false;
        me.btn.moniter = '开始追踪';

        me._trail_stop();
      }
    },
    // 开始追踪
    _trail_start() {
      var me = this;
      // 奔跑精度
      var num = 0.0005;
      var p = me.pt.getPosition();
      var old_p = [p.lng, p.lat];

      var new_p = [
        p.lng + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
        p.lat + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num)
      ];

      // 移动点
      me.pt.setPosition(new AMap.LngLat(new_p[0], new_p[1]));
      // 画线
      me._trail_line([old_p, new_p], me.line);
      // 最优视角
      me.map.setFitView([me.pt]);
      // 判断是否在围栏内部
      me.in_or_out();

      // 点的收集
      me.line_arr.push(new_p);

      me.trail_key = true;
      // 开启定时器
      me.timer = setTimeout(function() {
        // 开启
        if (me.trail_key) {
          me._trail_start();
        }
        // 关闭
        else {
          return;
        }
      }, cc.map.one_time);
    },
    // 停止追踪
    _trail_stop() {
      var me = this;
      clearTimeout(me.timer);
      me.trail_key = false;

      var params = new URLSearchParams();
      params.append('sn', me.sn);
      params.append('line', JSON.stringify(me.line_arr));


      me.$cchttp.post(me.$url.line.L_add, params)
        .then(function(data) {

          // 数据容器
          me.line_arr.length = 0;
          // 清除折线
          me.polyline_arr.forEach(function(element, index) {
            // 定时清除线
            setTimeout(function() {
              element.setMap(null);
            }, index * 200)
          });
          // 清除容器
          me.polyline_arr.length = 0;
        });
    },
    //追踪的线
    _trail_line(points, opts) {
      var me = this;
      var polyLine = new AMap.Polyline({
        path: points,
        strokeColor: (opts.strokeColor || "#21536d"),
        strokeWeight: (opts.strokeWeight || 4),
        strokeOpacity: (opts.strokeOpacity || 0.8),
        strokeStyle: opts.strokeStyle, //线样式
        strokeDasharray: opts.strokeDasharray //补充线样式
      });
      polyLine.setMap(me.map);
      // 收集折线
      me.polyline_arr.push(polyLine);
    },





    // ----------------------------------------------------具体的打点one
    _draw_one(data) {
      var me = this;
      // 清除地图
      var p = JSON.parse(data.lnglat);
      // 没有收集数据时
      if (!me.pt) {
        me.pt = new AMap.Marker({
          position: [p.lng, p.lat],
          offset: new AMap.Pixel(-cc.map.img_w / 2, -cc.map.img_h),
        });
        me._sn_label(me.pt, data);
        me.pt.setMap(me.map);
        // 最优视角
        me.map.setFitView([me.pt]);
      }
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
    // 判断设备是否在围栏内部
    in_or_out() {
      var me = this;
      var arr = me.fence_arr;
      if (arr.length) {
        return;
      }
      // 隐藏状态
      if (!me.fence_key) {
        return;
      }
      arr.forEach(function(element, index) {
        if (element.contains(me.pt.getPosition())) {
          me.$notify.info({
            title: '已进入' + element.name + '围栏',
          });
        }
      });
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
  beforeDestroy: function() {
    var me = this;
    clearTimeout(me.timer);
    me.trail_key = true;
  },
  // ---------------------组件注册
  components: {},
}
</script>
<style lang="less">
// 这里不能把属性设置为私有
@import '../css/commom/main.less';
#moniter {
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
    #btn_moniter {
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
        top: -42px;
        left: -53px;
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
          left: 78px;
          margin-left: -5px;
          border-width: 8px 8px 0;
          border-top-color: rgba(238, 99, 99, 0.8);
        }
      }
    }
  }
}
</style>
