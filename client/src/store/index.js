import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'

Vue.use(Vuex);

// new Vuex.Store--为大写
export default new Vuex.Store({
  modules: {
    mutations
  },
  actions
})
