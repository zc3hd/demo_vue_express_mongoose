export default {
  data: function() {
    return {
      nav: {
        // 默认选择
        active_key: '0',
        list: [
          // 
          {
            path: "/monitor",
            name: "设备监控",
          }
        ],
      },
    }
  },
  mounted: function() {
    var me = this;
    me.nav_data();
  },
  methods: {
    // -------------------------------------数据传过来--进行权限查询
    nav_data() {
      var me = this;
      // me.$phone.$on('top_nav_list', function(data) {
      //   me.nav_data_ajax(data.powers);
      // });
    },
    // --------------------------------------根据拿到的数据请求数据
    nav_data_ajax(arr) {
      var me = this;
      var keys = arr.join(',');
      var params = new URLSearchParams();
      params.append('keys', keys);
      me.$ajax
        .post(me.$url.user.find_power, params)
        .then(function(data_p) {
          // 把请求回来的导航数据存起来。
          me.nav.list = data_p.data;
          // 发出默认的第一个路由请求。
          me.nav.active_key = "0";

          // 转跳第一个路由
          me.$Router.push({
            path: me.nav.list[0].path
          });

          // ------------------------------设置session
          $.session.set('nav_list', JSON.stringify(me.nav.list));
        });
    },

    // --------------------------------------不会传数据过来的时候
    no_data_in() {
      var me = this;
      var list = $.session.get('nav_list');
      // 没有数据
      if (!list) {
        return
      }
      me.nav.list = JSON.parse(list);
    },
  },
  watch: {
    $route(to) {
      var me = this;

      // --------------------先渲染路由
      // 只要路由不是/login
      if (to.path != '/login') {
        me.no_data_in();
      }

      // --------------------设置当前的类
      me.$nextTick(function() {
        var arr = $('#nav_ul>li');
        arr.removeClass('is-active');
        for (var i = 0; i < arr.length; i++) {
          if ($(arr[i]).attr('path') == to.path) {
            $(arr[i]).addClass("is-active");
          }
        }
      });

    }
  },

}
