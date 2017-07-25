<template>
  <div id="app">
    <loading v-show="loading_st"></loading>
    <!-- 导航 -->
    <keep-alive>
      <menuNav v-show="header_show"></menuNav>
    </keep-alive>
    <!-- 视图 -->
    <div class="main_cont" id="main_cont">
      <router-view></router-view>
    </div>
    <!-- 背景 -->
    <canvas class="background"></canvas>
  </div>
</template>
<script>
// -------------------------------------------------------组件
// --导航
import menuNav from './components/nav.vue'

// --------------------------------------------------------vuex
import {
  mapGetters
} from 'vuex';

export default {
  name: 'app',
  data() {
    return {
      dom: null,
    }
  },
  computed: mapGetters([
    'header_show',
    'loading_st'
  ]),
  methods: {},
  watch: {
    header_show: (val, oldVal) => {},
    // 在根组件下设置路由的监听
    $route(to) {
      var me = this;
      var name = $.session.get('name');
      // 登录成功
      if (name) {
        // 登录界面
        if (to.path == '/login') {
          me.dom.style.backgroundColor = 'transparent';
          me.dom.style.width = '100%';
        }
        // 其他界面--这是登录成功的
        else {
          me.dom.style.backgroundColor = 'rgba(0,0,0,0.6)';
          me.dom.style.width = '84%';
        }
      }
      // 未登录
      else {
        if (to.path == '/login') {
          me.dom.style.backgroundColor = 'transparent';
          me.dom.style.width = '100%';
          return
        }
        // 其他界面--这是登录成功的
        else {
          me.$Router.push({
            path: '/login'
          });
        }
      }

    }
  },
  components: {
    menuNav,
  },
  mounted() {
    Particles.init({
      selector: '.background',
      maxParticles: 100,
      color: '#f6a7e9',
      connectParticles: true
    });
    // 绑定完成后拿到dom
    this.dom = this.$el.children[2];
  },
}
</script>
<!-- 导航菜单 -->
<style lang="less">
@import './css/commom/main.less';
#app {
  width: 100%;
  height: 100%;
  background: url('/imgs/sign_bg.jpg') bottom no-repeat transparent;
  background-size: cover;
  >.background {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    z-index: 0;
  }
  // background-color: blue;
  >.main_cont {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1;
    background-color: @main_bgc;
    height: 100%;
    width: 84%;
  }
}
</style>
