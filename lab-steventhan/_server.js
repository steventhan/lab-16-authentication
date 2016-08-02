'user strict';

const server = require('express')();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const serverLog = require('debug')('serverlog:error');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/auth_db');

server.use('/api', require('./routes/auth_router'));

server.use((err, req, res, next) => {
  serverLog(err);
  next(err);
});

module.exports = exports = server;
