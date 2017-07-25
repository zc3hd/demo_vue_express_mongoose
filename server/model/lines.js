var mongoose = require('mongoose');

//schema
var UserSchema = new mongoose.Schema({
  "sn": String,
  "line":String,
});

//model
var Line = mongoose.model("lines", UserSchema);


// 超级管理员
// Dev.create({
//   "sn": 'SN001',
//   "state": false,
//   "memo":"这是一个2年租期的设置"
// });

  // User.findOne({"name":"admin"}, function(err, docs) {
  // 	console.log(docs);
  // 	docs.powers = [0,1,2,4];
  // 	docs.save();
  // });

// UserSchema.methods.test = function () {
// 	console.log('asd');
// };

// var asd = new User({
// 	"name": 'String',
//   "password": 111234,
//   "course": [0],
//   "powers": [2,3]
// });

// asd.test();

module.exports = Line;
