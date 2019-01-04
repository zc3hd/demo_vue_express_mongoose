<template>
  <div id="moniter">
    <!-- <topHeader></topHeader> -->
    <!-- *********************************************地图区********************************************* -->
    <div id="main_contain_map">
      <!-- 地图 -->
      <div style="width:100%;height:100%;" id="map"></div>
    </div>
  </div>
</template>
<script>
export default {
  // 全部设备的监控
  name: 'moniter',
  // -----------------------配置
  data() {
    return {
      arr_sn: [],
      // 监控timer
      timer: null,
      // 开关
      moniter_key: true,
    }
  },
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
  methods: {
    init: function(id) {
      var me = this;
      // 执行代码
      me.id = id;
      // 初始化父级样式
      me._init_style();
      //开启控件
      me.init_Baner();
      setTimeout(function() {
        me.init_event();
      }, 500);

      return;
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
        // me.$store.dispatch('head_show');

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
      me._sns_data();
    },
    // 获取全部数据
    _sns_data() {
      var me = this;
      me.$cchttp.post(me.$url.dev.f_devs_map)
        .then(function(data) {
          me._sns_draw(data.data);
        });
    },

    // 打点
    _sns_draw(arr) {
      var me = this;
      me.map.clearMap();
      arr.forEach(function(item, index) {
        me._draw_one(item);
      });
      // 全部点打完成后进行最优视角
      me.map.setFitView(me.arr_sn);
    },
    // 具体的打点one
    _draw_one(data) {
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
  },
  // -------------------------------------周期
  beforeCreate() {},

  beforeDestroy: function() {
    var me = this;
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
