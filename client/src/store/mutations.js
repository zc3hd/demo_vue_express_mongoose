import getters from './getters.js'

const state = {
  // 顶部通栏的状态
  header_show: false,

  // loading
  loading_st: false,
}

const mutations = {
  // 顶部通栏
  head_show(state) {
    state.header_show = true;
  },
  head_hide(state) {
    state.header_show = false;
  },
  // -------------------------loading
  loading_show(state) {
    state.loading_st = true;
  },
  loading_hide(state) {
    state.loading_st = false;
  },
};

export default {
  state,
  getters,
  mutations
}
