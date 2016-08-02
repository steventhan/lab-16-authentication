'use strict';

const mongoose = require('mongoose'),
  Promise = require('bluebird'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken');

process.env.APP_SECRET = process.env.APP_SECRET || 'secret';

let userSchema = new mongoose.Schema({
  username: String,
  basic: {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
  }
});

userSchema.methods.generateHash = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return reject(err);
      this.basic.password = hashedPassword;
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

userSchema.methods.comparePassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.basic.password, (err, data) => {
      if (err) return reject(err);
      if (data === false) return reject(new Error('Password did not match'));
      resolve({token: jwt.sign({idd: this.basic.email}, process.env.APP_SECRET)});
    });
  });
};

module.exports = exports = mongoose.model('User', userSchema);
