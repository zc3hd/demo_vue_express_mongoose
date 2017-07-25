import Vue from 'vue'
import App from './App.vue'

// -------------------------------------------eleUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI);

// -------------------------------------------DIY VM
// 引入全局组件
import Loading from './components/loading'
Vue.use(Loading);

import topHeader from './components/top_header'
Vue.use(topHeader);


// -------------------------------------------过滤器
import filters from './filters'
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

// ------------------------------------------router
import VueRouter from 'vue-router'
Vue.use(VueRouter);
import routes from './router.config.js'
// // 这个属性必须叫--routes
const router=new VueRouter({
	//切换路径模式，变成history模式
	mode: 'history',
	routes
});
// 需要挂载router的工具包
Vue.prototype.$Router = router;


// ------------------------------------------vuex--store
import store from './store/index.js'

// ------------------------------------------style
// require('./css/base.css'); //引入全局的base文件


// ------------------------------------------axios
import axiosFn from './axios.config.js'
axiosFn(store,Vue);


// ------------------------------------------组件的通信设置
Vue.prototype.$phone = new Vue();


// ------------------------------------------init-app
new Vue({
  el: '#app',

  // 挂载全局store状态机
  store,

  // 开启路由
  router,

  // 绑定根组件
  render: h => h(App)
})