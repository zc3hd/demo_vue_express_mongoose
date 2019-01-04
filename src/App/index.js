// -------------------------------------------------------组件
// --导航
import cc_nav from '../nav/index.vue';

export default {
  components: {
    cc_nav: cc_nav,
  },
  data() {
    return {
      str: {
        // 盒子的宽度
        box_class: "",
      },
      nav_show: false,
    }
  },
    // x的公共数据
  computed: {
    // 导航的显示
    $x_nav_show: function() {
      return this.$store.state.$x_nav_show;
    },
    // router-view盒子的样式
    $x_box_class: function() {
      return this.$store.state.$x_box_class;
    },
  },
  mounted() {
    Particles.init({
      selector: '.background',
      maxParticles: 100,
      color: '#f6a7e9',
      connectParticles: true
    });
  },
  methods: {

  },
  watch: {
    // 在根组件下设置路由的监听：设置box的样式
    $route(to) {
      var me = this;
      // 登录成功
      if ($.session.get('name')) {
        // /login:
        if (to.path == '/login') {
          // view
          me.$store.commit('change_view', "box_login");
          // nav
          me.$store.commit('change_nav', false);
        }
        // 其他路由
        else {
          // view
          me.$store.commit('change_view', "");
          // nav
          me.$store.commit('change_nav', true);
        }
      }
      // 未登录
      else {
        // /login:
        if (to.path == '/login') {
          // view
          me.$store.commit('change_view', "box_login");
          // nav
          me.$store.commit('change_nav', false);
        }
        // 其他路由
        else {
          me.$router.replace({ path: '/login' })
        }
      }

    }
  },
}
