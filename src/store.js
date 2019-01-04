Vue.use(Vuex);

// 初始化状态
var state = {
  // 顶部通栏的状态
  $x_box_class: "",

  // 导航是否显示
  $x_nav_show: false,
};

var mutations = {
  // 改变view的样式
  change_view: function(state, info) {
    state.$x_box_class = info;
  },
  change_nav: function(state, info) {
    state.$x_nav_show = info;
  },


};

export default new Vuex.Store({
  // getters: getters,
  state: state,
  // actions: actions,
  mutations: mutations,
});
