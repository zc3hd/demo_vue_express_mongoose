var mongoose = require('mongoose');

// 集合标识
var model_key = 'dev';

// 文档模型
var doc_model = new mongoose.Schema({
  "sn": String,
  "line":String,
});

// 模型
module.exports = mongoose.model("lines", doc_model);

