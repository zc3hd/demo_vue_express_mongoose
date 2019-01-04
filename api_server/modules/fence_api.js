function Module(app) {
  var me = this;

  // 
  me.app = app;
  // 路由
  me.router = require('express').Router();

  // 模型
  me.Fence_model = require('../collection/fence.js');

}
Module.prototype = {
  init: function() {
    var me = this;

    // 配置前缀
    me.api_pro = '/api/fence';

    // list
    me.router.post('/list.do', function(req, res) {
      me._list(req, res);
    });

    // add
    me.router.post('/add.do', function(req, res) {
      me._add(req, res);
    });

    // upd
    me.router.post('/upd.do', function(req, res) {
      me._upd(req, res);
    });

    // del
    me.router.post('/del.do', function(req, res) {
      me._del(req, res);
    });


    me.app.use(me.api_pro, me.router);
  },
  //
  _list: function(req, res) {
    var me = this;
    me.Fence_model
      .find(req.body)
      .then(function(data) {
        res.send(docs);
      });
  },
  _add: function(req, res) {
    var me = this;
    // 创建
    me.Fence_model
      .create(req.body)
      .then(function(data) {
        res.send({ ret: 1 });
      })
  },
  _upd: function(req, res) {
    var me = this;
    // 创建
    me.Fence_model
      .findById(req.body.user_id)
      .then(function(doc) {

        doc.name = req.body.name;
        doc.center = req.body.center;
        doc.radius = req.body.radius;
        doc.region = req.body.region;

        doc.alarm = req.body.alarm;
        doc.type = req.body.type;

        return docs.save();

      })
      // 返回
      .then(function() {
        res.send({ ret: 1 });
      });
  },
  _del: function(req, res) {
    var me = this;
    // 创建
    me.Fence_model
      .deleteOne(req.body)
      // 返回
      .then(function() {
        res.send({ ret: 1 });
      });
  },
};



module.exports = Module;
