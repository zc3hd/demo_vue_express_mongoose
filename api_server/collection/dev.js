var mongoose = require('mongoose');

// 集合标识
var model_key = 'dev';

// 文档模型
var doc_model = new mongoose.Schema({
  "sn": String,
  "state": Boolean,
  "memo":String,
  "lnglat":String,
});

// 模型
module.exports = mongoose.model("dev", doc_model);


