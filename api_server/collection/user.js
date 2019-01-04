var mongoose = require('mongoose');


// 集合标识
var model_key = 'user';

// 文档模型
var doc_model = new mongoose.Schema({
  name: { type: String, unique: true },
  "ps": String,
});

// 模型
module.exports = mongoose.model("user", doc_model, model_key);
