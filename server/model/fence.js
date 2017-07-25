var mongoose = require('mongoose');

//schema
var UserSchema = new mongoose.Schema({
  "name": String,
  "sn": String,
  // 报警形式
  "alarm": Number,
  // 形状
  "type": Number,
  // 中心点
  "center":String,
  // 半径
  "radius":Number,
  // 边点
  "region":String,
});

//model
var Fence = mongoose.model("fences", UserSchema);


// 超级管理员
// Fence.create({
//   "name": "1-f",
//   "sn": "aa",
//   // 报警形式
//   "alarm": 0,
//   // 形状
//   "type": 0,
//   // 中心点
//   "center":"[116.225472, 39.940538]",
//   // 半径
//   "radius":7000,
//   // 边点
//   "region":"",
// });

// Fence.create({
//   "name": "2-f",
//   "sn": "aa",
//   // 报警形式
//   "alarm": 1,
//   // 形状
//   "type": 2,
//   // 中心点
//   "center":"",
//   // 半径
//   "radius":"",
//   // 边点
//   "region":'[{"lng": 116.250191,"lat": 40.027349}, {"lng": 116.381341,"lat": 40.074653}, {"lng": 116.533776,"lat": 39.950014}, {"lng": 116.232339,"lat": 39.845183}]',
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

module.exports = Fence;
