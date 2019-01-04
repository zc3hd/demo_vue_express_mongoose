// -------------------------------------------eleUI
// import ElementUI from 'element-ui';
// 
// Vue.use(ElementUI);
import {
  // 
  Message,
  Menu,
  Submenu,
  MenuItem,
} from 'element-ui';
// import 'element-ui/lib/theme-default/index.css';
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
// Vue.use(Radio);
// Vue.use(TimePicker);
Vue.prototype.$ele_msg = Message;


// -------------------------------------------DIY VM
// 引入全局组件
// import Loading from './components/loading'
// Vue.use(Loading);

// import topHeader from './components/top_header'
// Vue.use(topHeader);


// -------------------------------------------过滤器
// import filters from './filters'
// Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

// ------------------------------------------router
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import routes from './routes.js'
const router = new VueRouter({
  //切换路径模式，变成history模式
  // mode: 'history',
  // 这个属性必须叫--routes
  routes: routes
});


// ------------------------------------------vuex
import store from './store.js';


// ------------------------------------------axios
Vue.prototype.$ajax = axios;


// 根组件
import App from './App/index.vue';
// ------------------------------------------init-app
new Vue({

  el: '#app',
  // 绑定根组件
  render: h => h(App),

  // 开启路由
  router: router,
  // =====================vuex
  store: store,
})
