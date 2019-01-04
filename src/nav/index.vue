<template>
  <div class="nav">
    <el-menu :default-active="nav.active_key" :router="true" id="nav_ul">
      <el-menu-item v-for="(val,Index) in nav.list" :index='val.id' :route='{path:val.path}' v-bind="{ path: val.path}">
        {{val.name}}
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import obj from './index.js'
export default obj;
</script>
<style lang="less" scoped>
@import './index.less';
</style>
