'use strict';

const Router = require('express').Router,
  jsonParser = require('body-parser').json(),
  createError = require('http-errors'),
  User = require('../models/user'),
  basicHTTP = require('../lib/basic_http');

let authRouter = new Router();

authRouter.post('/signup', jsonParser, (req, res, next) => {
  let newUser = new User();
  newUser.basic.email = req.body.email;
  newUser.username = req.body.username || req.body.email;
  newUser.generateHash(req.body.password)
    .then(() => {
      newUser.save()
        .then(res.json.bind(res))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

authRouter.get('/signin', basicHTTP, (req, res, next) => {
  User.findOne({'basic.email': req.auth.username})
    .then((user) => {
      if(!user) return next(createError(401, 'Unable to authenticate'));
      user.comparePassword(req.auth.password)
        .then(res.json.bind(res))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = exports = authRouter;
