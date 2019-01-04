function Module(app) {
  var me = this;

  // 
  me.app = app;
  // 路由
  me.router = require('express').Router();

  // 模型
  me.Line_model = require('../collection/line.js');

}
Module.prototype = {
  init: function() {
    var me = this;

    // 配置前缀
    me.api_pro = '/api/line';

    // list
    me.router.post('/list.do', function(req, res) {
      me._list(req, res);
    });

    // add
    me.router.post('/add.do', function(req, res) {
      me._add(req, res);
    });


    me.app.use(me.api_pro, me.router);
  },
  //
  _list: function(req, res) {
    var me = this;
    me.Line_model
      .find(req.body)
      .then(function(data) {
        res.send(docs);
      });
  },
  _add: function(req, res) {
    var me = this;
    // 创建
    me.Line_model
      .create(req.body)
      .then(function(data) {
        res.send({ ret: 1 });
      })
  },
};



module.exports = Module;
