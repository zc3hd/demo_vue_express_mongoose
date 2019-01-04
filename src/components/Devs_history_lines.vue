<template>
  <div id="moniter">
    <topHeader></topHeader>
    <!-- *********************************************地图区********************************************* -->
    <div id="main_contain_map">
      <!-- 轨迹框 -->
      <div id="lines">
        <div id="lines_list">
          <p v-for='(val,index) in list' @click="show_init(val.line,index)">
            <el-tag :class="{active_p:(active_index==index)}">轨迹 {{index+1}} </el-tag>
          </p>
        </div>
        <span id="btn_list" class="el-icon-caret-left" @click='list_control($event)'></span>
      </div>
      <!-- 地图 -->
      <div style="width:100%;height:100%;" id="map"></div>
      <!-- 按钮组 -->
      <el-button-group>
        <el-button type="primary" class='cc-map-lines-play2' @click="start"></el-button>
        <el-button type="primary" class='cc-map-lines-pause' @click="pause"></el-button>
        <el-button type="primary" class='cc-map-lines-cart' @click="resume"></el-button>
        <el-button type="primary" class='cc-map-lines-stop' @click="stop"></el-button>
      </el-button-group>
    </div>
  </div>
</template>
<script>
export default {
  name: 'moniter',
  // -----------------------配置
  data() {
    return {
      // ---------------------------------------line
      list: [],
      active_index: -1,
      // ------------------------------------线的样式
      // 未经过的线的样式
      line_off: {
        strokeColor: "#C0FF3E", //线颜色
        strokeOpacity: 0.5, //线透明度
        strokeWeight: 5, //线宽
        strokeStyle: "dashed", //线样式
        strokeDasharray: [10, 5] //补充线样式
      },
      line_on: {
        strokeColor: "#C0FF3E", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 5, //线宽
        strokeStyle: "solid", //线样式
        strokeDasharray: [10, 5] //补充线样式
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
    list_control(ev) {
      var me = this;
      var left = ev.target.parentNode.offsetLeft;
      // 设置隐藏
      if (left == 0) {
        ev.target.parentNode.style.left = `-${ev.target.parentNode.offsetWidth}px`;

        ev.target.classList.add('el-icon-caret-right');
      }
      // 设置显示
      else {
        ev.target.parentNode.style.left = '0';
        ev.target.classList.remove('el-icon-caret-right');
      }
      // console.log(ev);
      // console.log();
      // console.log();
      // 
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
      me._line_init();
    },
    // 获取单个设备的数据
    _line_init() {
      var me = this;
      var sn = me.sn = $.session.get('sn');
      me._init_data();
    },
    // ajax数据请求回来
    _init_data() {
      var me = this;
      var params = new URLSearchParams();
      params.append('sn', me.sn);
      me.$cchttp.post(me.$url.line.L_all, params)
        .then(function(data) {
          // 没有数据
          if (!data.data.length) {
            me.$notify({
              title: '该设备没有轨迹数据~',
              type: 'info',
            });
            return
          }
          me.list = data.data;
        })
    },
    // 点击每一条数据进行数据打点
    show_init(data, index) {
      var me = this;
      // 选择到当前的index
      me.active_index = index;

      var arr = JSON.parse(data);
      me.arr = arr;
      // 清除地图
      me.map.clearMap();

      // 没有走过的线的设置
      me.show_line_off(arr);
      // 走过的地方的设置
      me.show_line_on([]);

      // 打marker
      me.show_marker(arr[0]);

      // 全部点打完成后进行最优视角
      me.map.setFitView([me.car, me.polyline]);
    },
    // marker
    show_marker(data) {
      var me = this;
      me.car = new AMap.Marker({
        map: me.map,
        position: data,
        icon: "http://webapi.amap.com/images/car.png",
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true
      });
      me.car.on('moving', function(e) {
        me.passedPolyline.setPath(e.passedPath);
        // me.map.setFitView([me.car, me.passedPolyline]);
      });
    },
    // 没有走过的线的样式
    show_line_off(arr) {
      var me = this;
      me.polyline = new AMap.Polyline(me.line_off);
      me.polyline.setPath(arr);
      me.polyline.setMap(me.map);
    },
    // 走过的线的样式
    show_line_on(arr) {
      var me = this;
      me.passedPolyline = new AMap.Polyline(me.line_on);
      me.passedPolyline.setPath(arr);
      me.passedPolyline.setMap(me.map);
    },

    // ---------------------------------------按钮
    start() {
      var me = this;
      me.car.moveAlong(me.arr, 500);
    },
    pause() {
      var me = this;
      me.car.pauseMove();
    },
    resume() {
      var me = this;
      me.car.resumeMove();
    },
    stop() {
      var me = this;
      me.car.stopMove();
    }


  },

  // -------------------------------------周期
  beforeCreate() {},
  mounted() {
    // 历史轨迹列表
    $("#lines_list").niceScroll({
      cursorwidth: 12,
      cursoropacitymin: 0.4,
      cursorcolor: '#6e8cb6',
      cursorborder: 'none',
      cursorborderradius: 4,
      autohidemode: 'leave'
    });
    this.init('map');
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
// login图标
@import '../css/map-line/style.css';
#moniter {
  height: 100%;
  box-sizing: border-box;
  // padding-top: @header_h+10px;
  // position: relative;
  background-color: transparent;
  overflow-x: auto;
  >#main_contain_map {
    position: relative;
    // 轨迹的列表
    >#lines {
      position: absolute;
      top: 0;
      left: 0;
      width: 8%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      z-index: 1;
      transition: all 0.3s ease-in;
      // 列表
      >#lines_list {
        >p {
          margin: 0;
          margin-top: 5px;
          padding-left: 20px;
          padding-right: 20px;
          height: 30px;
          cursor: pointer;
          text-align: center;
          >.active_p {
            background-color: rgba(0, 0, 0, 0.8);
          }
        }
      }
      // 按钮
      >#btn_list {
        cursor: pointer;
        position: absolute;
        top: 50%;
        right: -15px;
        color: #fff;
      }
    }
    >.el-button-group {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
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
