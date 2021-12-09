// server/models/userModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 email: {
  type: String,
  trim: true
 },
 password: {
  type: String
 },
 role: {
  type: String,
  default: 'basic',
  enum: ["basic", "supervisor", "admin"]
 }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;