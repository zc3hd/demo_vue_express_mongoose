function Module(app) {
  var me = this;

  // 
  me.app = app;
  // 路由
  me.router = require('express').Router();

  // 模型
  me.Power_model = require('../collection/power.js');

}
Module.prototype = {
  init: function() {
    var me = this;

    // 配置前缀
    me.api_pro = '/api/power';

    // 查询选中权限
    me.router.post('/find_power.do', function(req, res) {
      me._find_power(req, res);
    });

    // 查询所有权限
    me.router.post('/find_all_power.do', function(req, res) {
      me._find_all_power(req, res);
    });



    me.app.use(me.api_pro, me.router);
  },
  //
  _find_power: function(req, res) {
    var me = this;

    var keys = req.body.keys.split(',');
    var arr = [];
    for (var i = 0; i < keys.length; i++) {
      arr.push({ id: keys[i] });
    }

    me.Power_model
      .find({
        $or: arr
      }, function(err, docs) {
        res.send(docs);
      });
  },
  //
  _find_all_power: function(req, res) {
    var me = this;

    me.Power_model
      .find({}, function(err, docs) {
        res.send(docs);
      });
  },

};



module.exports = Module;
