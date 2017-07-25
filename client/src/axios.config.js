import axios from 'axios'

export default function(store,Vue) {
  //axios的一些配置，比如发送请求显示loading，请求回来loading消失之类的

	//配置发送请求的信息
  axios.interceptors.request.use(function(config) { 
    // 引入过来的对象上面有dispatch方法
    store.dispatch('loading_show');
    return config;
  }, function(error) {
    return Promise.reject(error);
  });

  //配置请求回来的信息
  axios.interceptors.response.use(function(response) { 
    store.dispatch('loading_hide');
    return response;
  }, function(error) {

    return Promise.reject(error);
  });

  /*axios.defaults.baseURL = (process.env.NODE_ENV !=='production' ? config.dev.httpUrl:config.build.httpUrl);
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';*/
  //axios.defaults.baseURL='http://localhost:8082/';
  axios.defaults.headers.common['Authorization'] = "AUTH_TOKEN";
  axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  //其他页面在使用axios的时候直接  this.$http就可以了
  // 这个配置很牛逼啊
  Vue.prototype.$cchttp = axios;

  // 配置全局的api--地址
  Vue.prototype.$url = new cc.module.API();
}
