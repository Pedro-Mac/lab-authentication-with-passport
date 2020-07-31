'use strict';

const { request } = require('express');

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('./models/user');
// Passport Strategy configuration

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
    .then(user => cb(null, user))
    .catch(err => cb(err));
});

passport.use(
  'sign-up',
  new localStrategy.Strategy({}, (username, password, callback) => {
    bcrypt
      .hash(password, 10)
      .then(hash => {
        return User.create({
          username,
          passwordHash: hash
        });
      })
      .then(user => {
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  })
);

passport.use(
  new localStrategy(
    'sign-in',
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    (username, password, cb) => {
      User.findOne({ username })
        .then(user => {
          if (!user) {
            return cb(null, false, { message: 'Incorrect username' });
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return cb(null, false, { message: 'incorrect password' });
          }

          cb(null, user);
        })
        .catch(err => cb(err));
    }
  )
);
