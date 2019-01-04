<template>
  <div id="app">
    <!-- <loading v-show="loading_st"></loading> -->
    <!-- 导航 -->
    <cc_nav v-show="$x_nav_show"></cc_nav>
    <!-- 视图 -->
    <div class="box" :class="$x_box_class">
      <router-view></router-view>
    </div>
    <!-- 背景 -->
    <canvas class="background"></canvas>
  </div>
</template>
<script>
import obj from './index.js';
export default obj;
</script>
<!-- 导航菜单 -->
<style lang="less">
@import './index.less';
</style>
