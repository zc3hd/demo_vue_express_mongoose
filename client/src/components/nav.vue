<template>
  <div class="nav">
    <el-menu :default-active="nav.active_key" :router="true" id="nav_ul">
      <el-menu-item v-for="(val,Index) in nav.list" :index='val.id' :route='{path:val.path}' v-bind="{ path: val.path}">
        <i :class="val.logo"></i>{{val.name}}
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
// import routes from '../router.config.js'

export default {
  name: 'nav',
  data() {
    return {
      nav: {
        // 默认选择
        active_key: '0',
        list: [],
      },
    }
  },
  methods: {
    // -------------------------------------数据传过来--进行权限查询
    nav_data() {
      var me = this;
      me.$phone.$on('top_nav_list', function(data) {
        me.nav_data_ajax(data.powers);
      });
    },
    // --------------------------------------根据拿到的数据请求数据
    nav_data_ajax(arr) {
      var me = this;
      var keys = arr.join(',');
      var params = new URLSearchParams();
      params.append('keys', keys);
      me.$cchttp.post(me.$url.user.find_power, params)
        .then(function(data_p) {
          // 把请求回来的导航数据存起来。
          me.nav.list = data_p.data;
          // 发出默认的第一个路由请求。
          me.nav.active_key = "0";

          // 转跳第一个路由
          me.$Router.push({
            path: me.nav.list[0].path
          });

          // ------------------------------设置session
          $.session.set('nav_list', JSON.stringify(me.nav.list));
        });
    },

    // --------------------------------------不会传数据过来的时候
    no_data_in() {
      var me = this;
      var list = $.session.get('nav_list');
      // 没有数据
      if (!list) {
        return
      }
      me.nav.list = JSON.parse(list);
    },
  },
  watch: {
    $route(to) {
      // 失败了。还是用jq了。
      var me = this;

      // --------------------先渲染路由
      // 只要路由不是/login
      if (to.path != '/login') {
        me.no_data_in();
      }

      // --------------------设置当前的类
      me.$nextTick(function() {
        var arr = $('#nav_ul>li');
        arr.removeClass('is-active');
        for (var i = 0; i < arr.length; i++) {
          if ($(arr[i]).attr('path') == to.path) {
            $(arr[i]).addClass("is-active");
          }
        }
      });

    }
  },
  mounted() {
    var me = this;
    // me._init();
    me.nav_data();
  },
  directives: {
    // acitem(el) {
    //   var el_path = el.getAttribute('path');
    //   var win_path = window.location.pathname;
    //   // el.setAttribute('class', 'el-menu-item');
    //   $(el).removeClass("is-active");

    //   if(el_path==win_path){
    //     el.addClass("is-active");
    //   }

    // }
  },
}
</script>
<style lang="less">
@import '../css/commom/main.less';
.nav {
  width: 15%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  left: 0;
  // 背景的层级高于就点不到菜单
  z-index: 1;
  >.el-menu {
    background-color: transparent;
    >.el-menu-item {
      color: #8fbdf5;
    }
    >.el-menu-item:hover {
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
    }
    >.is-active {
      color: white;
      background-color: rgba(0, 0, 0, 0.8);
    }
    // >.el-menu-item:hover{
    //  background-color: @mune_bgc;
    // }
  }
}
</style>
