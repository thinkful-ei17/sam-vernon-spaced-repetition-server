require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;

const loginRouter = express.Router();

const { JWT_SECRET } = require('../config');
const { JWT_EXPIRY } = require('../config');

const { localStrategy, jwtStrategy } = require('../strategies/strategies');
const User = require('../models/UserModel');

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', {session: false});
const localAuth = passport.authenticate('local', { session: false });

const createAuthToken = function(user) {
    return jwt.sign({user}, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

loginRouter.post('/login', localAuth, (req, res) => {
    console.log(JWT_SECRET);
    const authToken = createAuthToken(req.user.serialize());
    res.json({authToken});
});

loginRouter.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
});

loginRouter.post('/register', (req, res) => {
  const {firstName, lastName, username, password} = req.body;

  return User.find({username})
        .count()
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }

            return UserInfo.hashPassword(password);
        })
        .then(digest => {
            return UserInfo.create({
                username,
                password: digest,
                firstName,
                lastName
            });
        })
        .then(user => {  //not using nodemon to watch changes keep eye on log!
            return res.status(201).location(`/users/${user.id}`).json(user.serialize());
        })
        .catch(err => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: 'Internal server error'});
        });
});

module.exports = loginRouter;
