const topHeaderVm = require('./top_header.vue')
const topHeader = {
  install: function(Vue) {
    Vue.component('topHeader', topHeaderVm)
  }
}
// module.exports = loading
export default topHeader

