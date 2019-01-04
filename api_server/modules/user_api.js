function Module(app) {
  var me = this;

  // 
  me.app = app;
  // 路由
  me.router = require('express').Router();

  // 模型
  me.User_model = require('../collection/user.js');
  me.Dev_model = require('../collection/dev.js');

}
Module.prototype = {
  init: function() {
    var me = this;

    // 配置前缀
    me.api_pro = '/api/user';

    // 用户登录
    me.router.post('/sign_in.do', function(req, res) {
      me._sign_in(req, res);
    });

    // 用户注册
    me.router.post('/reg_in.do', function(req, res) {
      me._reg_in(req, res);
    });

    // 检查用户名
    me.router.post('/check_name.do', function(req, res) {
      me._check_name(req, res);
    });

    // 用户列表
    me.router.post('/find_all_users.do', function(req, res) {
      me._find_all_users(req, res);
    });

    // 分页查询用户
    me.router.post('/find_users_by_page.do', function(req, res) {
      me._find_users_by_page(req, res);
    });

    // 查询用户总数
    me.router.post('/find_all_users_count.do', function(req, res) {
      me._find_all_users_count(req, res);
    });

    // 添加用户
    me.router.post('/user_add.do', function(req, res) {
      me._user_add(req, res);
    });

    // 查找名字
    me.router.post('/find_users_by_name.do', function(req, res) {
      me._find_users_by_name(req, res);
    });

    // 修改用户
    me.router.post('/user_upd.do', function(req, res) {
      me._user_upd(req, res);
    });

    // 修改用户密码
    me.router.post('/user_upd_pw.do', function(req, res) {
      me._user_upd_pw(req, res);
    });

    // 删除用户
    me.router.post('/user_del.do', function(req, res) {
      me._user_del(req, res);
    });

    // 绑定设备
    me.router.post('/user_on_sn.do', function(req, res) {
      me._user_on_sn(req, res);
    });

    // 解除绑定
    me.router.post('/user_off_sn.do', function(req, res) {
      me._user_off_sn(req, res);
    });




    me.app.use(me.api_pro, me.router);
  },
  //
  _user_off_sn: function(req, res) {
    var me = this;

    var _id = req.body._id;

    // ---------------------------游客模式
    if (req.body.vis) {
      res.send({ ret: -1 });
      return;
    }



    me.User_model
      .findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, _user) {

        if (_user.sn == "" || _user.sn == undefined) {
          res.send({ ret: 0 });
          return;
        }
        me.Dev_model
          .findOne({ 'sn': _user.sn }, function(err, _dev) {
            _dev.state = !_dev.state;
            _dev.save();

            _user.sn = "";
            _user.save();
            res.send(_user);
          });

      });
  },
  //
  _user_on_sn: function(req, res) {
    var me = this;

    var _id = req.body._id;
    var sn = req.body.sn;

    // ---------------------------游客模式
    if (req.body.vis) {
      res.send({ ret: -1 });
      return;
    }

    me.Dev_model
      .findOne({ 'sn': sn }, function(err, docs) {
        // 没有该设备
        if (docs == null) {
          res.send({ ret: 0 });
        }
        // 已结被绑定
        else if (docs.state) {
          res.send({ ret: 2 });
        }
        // 没有绑定
        else {
          me.User_model
            .findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, u_docs) {
              u_docs.sn = sn;
              u_docs.save();

              // 设备的状态保存
              docs.state = !docs.state;
              docs.save();

              res.send({ ret: 1 });
            });
        }
      });
  },
  //
  _user_del: function(req, res) {
    var me = this;

    var _id = req.body._id;
    // ---------------------------游客模式
    if (req.body.vis) {
      me.User_model
        .find({}, function(err, docs) {
          res.send(docs);
        });
      return;
    }




    var user_name = null;
    me.User_model
      .findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, _user) {
        // 没有绑定设备
        if (_user.sn == "" || _user.sn == undefined) {
          me.User_model
            .deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
              res.send(docs);
            });
        }
        // 绑定设备后
        else {
          Dev.findOne({ 'sn': _user.sn }, function(err, _dev) {
            // 已经被绑定
            _dev.state = !_dev.state;
            _dev.save();

            me.User_model
              .deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
                res.send(docs);
              });
          });
        }

      });
  },
  //
  _sign_in: function(req, res) {
    var me = this;

    var name = req.body.name;
    var password = req.body.password;

    if (!req.session.aa) {
      req.session.aa = 'asd';
    } else {
      console.log(req.session.aa);
    }

    me.User_model
      .find({
        name: name,
      }, function(err, docs) {
        if (docs.length == 0) {
          res.send({ ret: -1, info: 'no user' });
        };
        for (var i = 0; i < docs.length; i++) {
          if (docs[i].password == password) {

            // 没有设置session
            res.send(docs[i]);
          } else {
            res.send({ ret: -1, info: 'password wrong' });
          }
        }
      });
  },
  _reg_in: function(req, res) {
    var me = this;
    var name = req.body.name;
    var password = req.body.password;
    var sn = req.body.sn;


    // 插入用户
    me.User_model
      .create({
        "name": name,
        "password": password,
        // 默认权限
        "powers": [2, 3, 4, 5],
        "sn": sn
      }, function(err, udocs) {
        // 插入设备
        me.Dev_model
          .create({
            "sn": sn,
            "state": true,
            "memo": '默认memo',
            "lnglat": '{"lng":116.66938776580825,"lat":39.84814196051961}'
          }, function(err, sndocs) {
            res.send(udocs);
          });
      });
  },
  _check_name: function(req, res) {
    var me = this;
    var name = req.body.name;

    me.User_model
      .find({
        name: name,
      }, function(err, udocs) {

        // 存在该用户名
        if (udocs.length != 0) {
          res.send({ ret: -1 });
        }
        // 不存在
        else {
          res.send({ ret: 1 });
        }
      });
  },
  _find_all_users: function(req, res) {
    var me = this;
    me.User_model
      .find({}, function(err, docs) {
        res.send(docs);
      });
  },
  _find_users_by_page: function(req, res) {
    var me = this;
    var name = req.body.name;
    var page = req.body.page;
    var size = req.body.size;
    var opts = {};
    // 有数据传递过来了。使用空对象
    if (name != undefined) {
      opts = { name: name };
    }

    var query = me.User_model.find(opts);
    query.skip((page - 1) * size);
    query.limit(size * 1);

    query.exec(function(err, rs) {
      if (err) {
        res.send(err);
      } else {
        // res.send(rs);
        me.User_model
          .find(opts, function(err, result) {
            jsonArray = { rows: rs, total: result.length };
            res.json(jsonArray);
          });
      }
    });
  },
  _find_all_users_count: function(req, res) {
    var me = this;
    me.User_model
      .count({}, function(err, docs) {
        // console.log(docs);
        res.send({ count: docs });
      });
  },
  _user_add: function(req, res) {
    var me = this;
    var name = req.body.name;
    var password = req.body.password;
    var powers = req.body.powers.split(',');

    // ---------------------------游客模式
    if (req.body.vis) {
      me.User_model
        .find({}, function(err, docs) {
          res.send(docs);
        });
      return;
    }

    // ---------------------------admin
    me.User_model
      .find({
        name: name,
      }, function(err, docs) {

        // 没有用户
        if (docs.length == 0) {

          me.User_model
            .create({
              "name": name,
              "password": password,
              "powers": powers
            }, function(err, docs) {
              res.send(docs);
            });

        }
        // 用户名重复
        else {
          res.send({ ret: -1, info: '' });
        }
      });
  },
  _find_users_by_name: function(req, res) {
    var me = this;
    var name = req.body.name;

    me.User_model
      .find({ 'name': name }, function(err, docs) {
        res.send(docs);
      });
  },
  _user_upd: function(req, res) {
    var me = this;
    var _id = req.body._id;
    var name = req.body.name;
    var powers = req.body.powers.split(',');


    // ---------------------------游客模式
    if (req.body.vis) {
      me.User_model
        .find({}, function(err, docs) {
          res.send(docs);
        });
      return;
    }


    // ---------------------------admin
    me.User_model
      .findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
        docs.name = name;
        docs.powers = powers;

        docs.save();
        res.send(docs);
      });
  },
  _user_upd_pw: function(req, res) {
    var me = this;
    var _id = req.body._id;
    var name = req.body.name;
    var _old = req.body.old;
    var _new = req.body.new;

    // ---------------------------游客模式
    if (req.body.vis) {
      res.send({ ret: -1 });
      return;
    }

    me.User_model
      .findOne({ 'name': name }, function(err, docs) {
        // 旧密码不对
        if (docs.password != _old) {
          res.send({ ret: 0, info: '旧密码不正确' });
        }
        // 正确
        else {
          docs.password = _new;
          docs.save();
          res.send({ ret: 1 });
        }
      });
  },


};



module.exports = Module;
