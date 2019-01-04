var mongoose = require('mongoose');

// 集合标识
var model_key = 'dev';

// 文档模型
var doc_model = new mongoose.Schema({
  "id": String,
  "name": String,
  "path": String,
  "logo":String,
});

// 模型
module.exports =  mongoose.model("power", doc_model);
