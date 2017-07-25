var mongoose = require('mongoose');
var User = require("../model/users.js");
var Dev = require("../model/devs.js");
var Power = require("../model/powers.js");
var Fence = require("../model/fence.js");
var Line = require("../model/lines.js");

// --------------------------------------------------------轨迹
// 增加
exports.L_add = function(req, res, next) {
  var sn = req.body.sn;
  var line = req.body.line;

  Line.create({
    "sn": sn,
    "line": line,
  }, function(err, docs) {
    res.send({ ret: 1 });
  });
};
// 查找所有的轨迹
exports.L_all = function(req, res, next) {
  var sn = req.body.sn;
  Line.find({ 'sn': sn }, function(err, docs) {
    res.send(docs);
  });
};



// --------------------------------------------------------围栏设置
// 查询所有围栏
exports.f_all_fence = function(req, res, next) {
  var sn = req.body.sn;
  Fence.find({ 'sn': sn }, function(err, docs) {
    res.send(docs);
  });
};

// 修改
exports.f_upd = function(req, res, next) {
  var _id = req.body._id;
  var name = req.body.name;

  var center = req.body.center;
  var radius = req.body.radius;

  var region = req.body.region;

  var alarm = req.body.alarm;
  var type = req.body.type;


  Fence.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {

    docs.name = name;

    docs.center = center;
    docs.radius = radius;
    docs.region = region;

    docs.alarm = alarm;
    docs.type = type;


    docs.save();
    res.send({ ret: 1 });
  });
};

// 删除
exports.f_del = function(req, res, next) {
  var _id = req.body._id;
  Fence.deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
    res.send({ ret: 1 });
  });
};

// 新增
exports.f_add = function(req, res, next) {
  var sn = req.body.sn;
  var name = req.body.name;

  var center = req.body.center;
  var radius = req.body.radius;

  var region = req.body.region;

  var alarm = req.body.alarm;
  var type = req.body.type;


  Fence.create({
    "sn": sn,
    "name": name,
    "center": center,
    "radius": radius,
    "region": region,
    "alarm": alarm,
    "type": type,
  }, function(err, docs) {
    res.send({ ret: 1 });
  });
};



// ----------------------------------------------------------设备
// 分页查询设备
exports.f_dev_by_page = function(req, res, next) {
  var sn = req.body.sn;
  var page = req.body.page;
  var size = req.body.size;
  var opts = {};
  // 有数据传递过来了。使用空对象
  if (sn != undefined) {
    opts = { sn: sn };
  }

  var query = Dev.find(opts);
  query.skip((page - 1) * size);
  query.limit(size * 1);

  query.exec(function(err, rs) {
    if (err) {
      res.send(err);
    } else {
      // res.send(rs);
      Dev.find(opts, function(err, result) {
        jsonArray = { rows: rs, total: result.length };
        res.json(jsonArray);
      });
    }
  });
};

// 获取所有的设备
exports.f_devs_map = function(req, res, next) {
  var p = null;
  // 奔跑精度
  var num = 0.0005;
  Dev.find({}, ['sn', 'state', 'lnglat'], function(err, docs) {
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
  })
};


// 添加
exports.dev_add = function(req, res, next) {
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
  Dev.findOne({ 'sn': sn }, function(err, docs) {
    // 已经存在该设备
    if (docs != null) {
      res.send({ ret: 2 });
    } else {
      Dev.create({
        "sn": sn,
        "state": state,
        "memo": memo,
        "lnglat": lnglat
      }, function(err, docs) {
        res.send({ ret: 1 });
      });
    }
  });
};
// check_sn
exports.check_sn = function(req, res, next) {
  var sn = req.body.sn;

  // 先查询设备
  Dev.findOne({ 'sn': sn }, function(err, docs) {
    // 已经存在该设备
    if (docs != null) {
      res.send({ ret: -1 });
    }
    // 
    else {
      res.send({ ret: 1 });
    }
  });
};

// 修改
exports.dev_upd = function(req, res, next) {
  var _id = req.body._id;
  var sn = req.body.sn;
  var memo = req.body.memo;
  var lnglat = req.body.lnglat;

  // ---------------------------游客模式
  if (req.body.vis) {
    res.send({ ret: -1 });
    return;
  }

  Dev.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
    docs.sn = sn;
    docs.memo = memo;
    docs.lnglat = lnglat;

    docs.save();
    res.send(docs);
  });
};

// 修改设备位置
exports.dev_upd_pos = function(req, res, next) {
  var sn = req.body.sn;
  var lnglat = req.body.lnglat;
  Dev.findOne({ 'sn': sn }, function(err, docs) {
    docs.lnglat = lnglat;

    docs.save();
    res.send(docs);
  });
};


// 删除
exports.dev_del = function(req, res, next) {
  var _id = req.body._id;
  var user_name = null;
  // ---------------------------游客模式
  if (req.body.vis) {
    res.send({ ret: -1 });
    return;
  }



  Dev.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
    // 已经被绑定
    if (docs.state) {
      res.send({ ret: 0 });
    }
    // 没有被绑定
    else {
      Dev.deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
        res.send({ ret: 1 });
      });
    }
  });
};
// 查询一个sn
exports.dev_f_one = function(req, res, next) {
  var sn = req.body.sn;
  var p = null;
  // 奔跑精度
  var num = 0.0005;

  Dev.findOne({ 'sn': sn }, function(err, docs) {
    p = JSON.parse(docs.lnglat);
    p = {
      lng: p.lng + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
      lat: p.lat + (Math.random() > 0.5 ? Math.random() * num : -Math.random() * num),
    };
    docs.lnglat = JSON.stringify(p);
    docs.save();
    res.send(docs);
  });
};




// -------------------------------------------------------------用户
// 用户登录
exports.sign_in = function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;

  User.find({
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
};

// 用户注册
exports.reg_in = function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var sn = req.body.sn;


  // 插入用户
  User.create({
    "name": name,
    "password": password,
    // 默认权限
    "powers": [2, 3, 4, 5],
    "sn": sn
  }, function(err, udocs) {
    // 插入设备
    Dev.create({
      "sn": sn,
      "state": true,
      "memo": '默认memo',
      "lnglat": '{"lng":116.66938776580825,"lat":39.84814196051961}'
    }, function(err, sndocs) {
      res.send(udocs);
    });
  });

};


// 检查用户名
exports.check_name = function(req, res, next) {
  var name = req.body.name;

  User.find({
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
};


// 用户列表
exports.find_all_users = function(req, res, next) {
  User.find({}, function(err, docs) {

    // for (var i = 0; i < docs.length; i++) {
    //   console.log(docs[i].powers.indexOf(0));
    //   // 添加用户功能的只有一个admin
    //   if (docs[i].powers.indexOf(0) != -1) {
    //     docs.splice(i, 1);
    //     break;
    //   }
    // }
    res.send(docs);
  });
  // console.log(User.count());
  // User.count({},function  (err, count) {
  //   console.log(err, count);
  // });
};


// 分页查询用户
exports.find_users_by_page = function(req, res, next) {
  var name = req.body.name;
  var page = req.body.page;
  var size = req.body.size;
  var opts = {};
  // 有数据传递过来了。使用空对象
  if (name != undefined) {
    opts = { name: name };
  }

  var query = User.find(opts);
  query.skip((page - 1) * size);
  query.limit(size * 1);

  query.exec(function(err, rs) {
    if (err) {
      res.send(err);
    } else {
      // res.send(rs);
      User.find(opts, function(err, result) {
        jsonArray = { rows: rs, total: result.length };
        res.json(jsonArray);
      });
    }
  });
};

// 查询用户总数
exports.find_all_users_count = function(req, res, next) {
  User.count({}, function(err, docs) {
    // console.log(docs);
    res.send({ count: docs });
  });
};

// 添加用户
exports.user_add = function(req, res, next) {
  var name = req.body.name;
  var password = req.body.password;
  var powers = req.body.powers.split(',');

  // ---------------------------游客模式
  if (req.body.vis) {
    User.find({}, function(err, docs) {
      res.send(docs);
    });
    return;
  }

  // ---------------------------admin
  User.find({
    name: name,
  }, function(err, docs) {

    // 没有用户
    if (docs.length == 0) {

      User.create({
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
};

// 查找名字
exports.find_users_by_name = function(req, res, next) {
  var name = req.body.name;

  User.find({ 'name': name }, function(err, docs) {
    res.send(docs);
  });
};

// 修改用户
exports.user_upd = function(req, res, next) {
  var _id = req.body._id;
  var name = req.body.name;
  var powers = req.body.powers.split(',');


  // ---------------------------游客模式
  if (req.body.vis) {
    User.find({}, function(err, docs) {
      res.send(docs);
    });
    return;
  }


  // ---------------------------admin
  User.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
    docs.name = name;
    docs.powers = powers;

    docs.save();
    res.send(docs);
  });
};

// 修改用户
exports.user_upd_pw = function(req, res, next) {
  var _id = req.body._id;
  var name = req.body.name;
  var _old = req.body.old;
  var _new = req.body.new;

  // ---------------------------游客模式
  if (req.body.vis) {
    res.send({ ret: -1 });
    return;
  }

  User.findOne({ 'name': name }, function(err, docs) {
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
};


// 删除用户
exports.user_del = function(req, res, next) {
  var _id = req.body._id;
  // ---------------------------游客模式
  if (req.body.vis) {
    User.find({}, function(err, docs) {
      res.send(docs);
    });
    return;
  }




  var user_name = null;
  User.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, _user) {
    // 没有绑定设备
    if (_user.sn == "" || _user.sn == undefined) {
      User.deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
        res.send(docs);
      });
    }
    // 绑定设备后
    else {
      Dev.findOne({ 'sn': _user.sn }, function(err, _dev) {
        // 已经被绑定
        _dev.state = !_dev.state;
        _dev.save();

        User.deleteOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, docs) {
          res.send(docs);
        });
      });
    }

  });


};

// 绑定设备
exports.user_on_sn = function(req, res, next) {
  var _id = req.body._id;
  var sn = req.body.sn;

  // ---------------------------游客模式
  if (req.body.vis) {
    res.send({ ret: -1 });
    return;
  }

  Dev.findOne({ 'sn': sn }, function(err, docs) {
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
      User.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, u_docs) {
        u_docs.sn = sn;
        u_docs.save();

        // 设备的状态保存
        docs.state = !docs.state;
        docs.save();

        res.send({ ret: 1 });
      });
    }
  });
};

// 解除绑定
exports.user_off_sn = function(req, res, next) {
  var _id = req.body._id;

  // ---------------------------游客模式
  if (req.body.vis) {
    res.send({ ret: -1 });
    return;
  }



  User.findOne({ '_id': mongoose.Types.ObjectId(_id) }, function(err, _user) {

    if (_user.sn == "" || _user.sn == undefined) {
      res.send({ ret: 0 });
      return;
    }
    Dev.findOne({ 'sn': _user.sn }, function(err, _dev) {
      _dev.state = !_dev.state;
      _dev.save();

      _user.sn = "";
      _user.save();
      res.send(_user);
    });

  });

};



// ----------------------------------------------------------权限
// 查询选中权限
exports.find_power = function(req, res, next) {
  var keys = req.body.keys.split(',');
  var arr = [];
  for (var i = 0; i < keys.length; i++) {
    arr.push({ id: keys[i] });
  }
  Power.find({
    $or: arr
  }, function(err, docs) {
    res.send(docs);
  })
};
// 查询所有权限
exports.find_all_power = function(req, res, next) {
  Power.find({}, function(err, docs) {
    res.send(docs);
  });
};
