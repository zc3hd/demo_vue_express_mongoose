export default {
  // 顶部栏显示
  head_show({ commit, state }) {
      commit('head_show');
    },
    // 隐藏导航栏
    head_hide({ commit, state }) {
      commit('head_hide');
    },
    // 显示loading
    loading_show({ commit, state }) {
      commit('loading_show');
    },
    // 隐藏loading
    loading_hide({ commit, state }) {
      commit('loading_hide');
    },
}
