function Module(app) {
  var me = this;

  // 
  me.app = app;
  // 路由
  me.router = require('express').Router();

  // 模型
  me.Dev_model = require('../collection/dev.js');

}
Module.prototype = {
  init: function() {
    var me = this;

    // 配置前缀
    me.api_pro = '/api/dev';

    // list
    me.router.post('/list.do', function(req, res) {
      me._list(req, res);
    });


    // 获取所有的设备
    me.router.post('/all.do', function(req, res) {
      me._all(req, res);
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


    // check_sn
    me.router.post('/check_sn.do', function(req, res) {
      me._check_sn(req, res);
    });

    // 修改经纬度
    me.router.post('/dev_upd_pos.do', function(req, res) {
      me._dev_upd_pos(req, res);
    });

    // findone
    me.router.post('/dev_f_one.do', function(req, res) {
      me._dev_f_one(req, res);
    });


    me.app.use(me.api_pro, me.router);
  },
  //
  _list: function(req, res) {
    var me = this;

    var sn = req.body.sn;
    var page = req.body.page;
    var size = req.body.size;
    var opts = {};
    var jsonArray = null;
    // 有数据传递过来了。使用空对象
    if (sn != undefined) {
      opts = { sn: sn };
    }

    var query = me.Dev_model.find(opts);
    query.skip((page - 1) * size);
    query.limit(size * 1);

    query.exec(function(err, rs) {
      if (err) {
        res.send(err);
      } else {
        // res.send(rs);
        me.Dev_model.find(opts, function(err, result) {
          jsonArray = { rows: rs, total: result.length };
          res.json(jsonArray);
        });
      }
    });
  },
  //
  _all: function(req, res) {
    var me = this;

    var p = null;
    // 奔跑精度
    var num = 0.0005;
    me.Dev_model
      .find({}, ['sn', 'state', 'lnglat'], function(err, docs) {
        for (var i = 0; i < docs.length; i++) {
          p = JSON.parse(docs[i].lnglat);
          p = {
            lng: p.lng + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
            lat: p.lat + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
          }
          docs[i].lnglat = JSON.stringify(p);
          docs[i].save();
        }
        res.send(docs);
      });
  },
  _add: function(req, res) {
    var me = this;
    // 创建

    var sn = req.body.sn;
    var state = req.body.state;
    var memo = req.body.memo;
    var lnglat = req.body.lnglat;

    // ---------------------------游客模式
    if (req.body.vis) {
      res.send({ ret: -1 });
      return;
    }

    // 先查询设备
    me.Dev_model
      .findOne({ 'sn': sn }, function(err, docs) {
        // 已经存在该设备
        if (docs != null) {
          res.send({ ret: 2 });
        } else {
          me.Dev_model
            .create({
              "sn": sn,
              "state": state,
              "memo": memo,
              "lnglat": lnglat
            }, function(err, docs) {
              res.send({ ret: 1 });
            });
        }
      });
  },
  // 
  _upd: function(req, res) {
    var me = this;
    // 创建

    var _id = req.body._id;
    var sn = req.body.sn;
    var memo = req.body.memo;
    var lnglat = req.body.lnglat;

    // ---------------------------游客模式
    if (req.body.vis) {
      res.send({ ret: -1 });
      return;
    }

    me.Dev_model
      .findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
        docs.sn = sn;
        docs.memo = memo;
        docs.lnglat = lnglat;

        docs.save();
        res.send(docs);
      });
  },
  _del: function(req, res) {
    var me = this;
    // 创建

    var _id = req.body._id;
    var user_name = null;
    // ---------------------------游客模式
    if (req.body.vis) {
      res.send({ ret: -1 });
      return;
    }

    me.Dev_model
      .findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
        // 已经被绑定
        if (docs.state) {
          res.send({ ret: 0 });
        }
        // 没有被绑定
        else {
          me.Dev_model
            .deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
              res.send({ ret: 1 });
            });
        }
      });
  },

  _check_sn: function(req, res) {
    var me = this;

    var sn = req.body.sn;
    // 先查询设备
    me.Dev_model
      .findOne({ 'sn': sn }, function(err, docs) {
        // 已经存在该设备
        if (docs != null) {
          res.send({ ret: -1 });
        }
        // 
        else {
          res.send({ ret: 1 });
        }
      });
  },
  _dev_upd_pos: function(req, res) {
    var me = this;
    var sn = req.body.sn;
    var lnglat = req.body.lnglat;
    me.Dev_model
      .findOne({ 'sn': sn }, function(err, docs) {
        docs.lnglat = lnglat;

        docs.save();
        res.send(docs);
      });
  },
  _dev_f_one: function(req, res) {
    var me = this;

    var sn = req.body.sn;
    var p = null;
    // 奔跑精度
    var num = 0.0005;

    me.Dev_model
      .findOne({ 'sn': sn }, function(err, docs) {
        p = JSON.parse(docs.lnglat);
        p = {
          lng: p.lng + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
          lat: p.lat + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
        };
        docs.lnglat = JSON.stringify(p);
        docs.save();
        res.send(docs);
      });
  },



};



module.exports = Module;
