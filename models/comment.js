const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
   // title: String,
   // description: String,
   // price: Number,
   // location: String,
   // image: String,
   author: userSchema,
   comments: String,
   date: Date,
});

module.exports = mongoose.model('Comment', commentSchema);