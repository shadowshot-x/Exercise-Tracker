const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  count: {type : Number, default: 0},
  log: {type: Array, default: []}
});
const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: {type: Date, default: Date.now},
  versionKey: false,
  _id: false
})

exports.User = mongoose.model('User', userSchema);
exports.Exercise = mongoose.model('Exercise', exerciseSchema)