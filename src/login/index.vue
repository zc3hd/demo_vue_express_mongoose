<template>
  <!-- <router-view></router-view> -->
  <div id="vm_login">



    <div class="box">
      <!-- 工具栏 -->
      <div class="tool">
        <div class="item" :class='(conf.key=="register"?"ac":"")' @click.stop='conf.key="register"'>register</div>
        <div class="item" :class='(conf.key=="sign"?"ac":"")' @click.stop='conf.key="sign"'>sign</div>
      </div>
      <!-- 列表 -->
      <div class="login_box">
        <div class="item" :style='conf.item_h'>
          <div class="info" :style='conf.item_info_lh'>username</div>
          <div class="ipt" :style='conf.item_ipt_padding'>
            <input type="text" v-model="obj.name" placeholder="username">
          </div>
        </div>
        <div class="item" :style='conf.item_h'>
          <div class="info" :style='conf.item_info_lh'>password</div>
          <div class="ipt" :style='conf.item_ipt_padding'>
            <input type="password" v-model="obj.ps" placeholder="***">
          </div>
        </div>


        <div class="btn" @click.stop='ev'></div>
      </div>
    </div>
    
  </div>
</template>
<script>
import obj from './index.js';
export default obj;
</script>
<!-- 导航菜单 -->
<style lang="less" scoped>
@import './index.less';
</style>
