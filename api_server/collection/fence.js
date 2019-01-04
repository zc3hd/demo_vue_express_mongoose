var mongoose = require('mongoose');


// 集合标识
var model_key = 'dev';

// 文档模型
var doc_model = new mongoose.Schema({
  "name": String,
  "sn": String,
  // 报警形式
  "alarm": Number,
  // 形状
  "type": Number,
  // 中心点
  "center": String,
  // 半径
  "radius": Number,
  // 边点
  "region": String,
});

// 模型
module.exports = mongoose.model("fences", doc_model);
