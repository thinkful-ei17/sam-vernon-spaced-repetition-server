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
  const requiredFields = ['username','firstName','lastName','password'];

    const missingField = requiredFields.find(field =>!(field in req.body));

    const nonStringField = requiredFields.find(
        field => field in req.body && typeof req.body[field] !== 'string');

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }
    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected string',
            location: nonStringField
        });
    }

    const sizedFields = {
        username: {
            min: 1
        },
        password: {
            min: 8,
            // bcrypt truncates after 72 characters, so let's not give the illusion
            // of security by storing extra (unused) info
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(field =>
        'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(field =>
        'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField]
                    .min} characters long`
                : `Must be at most ${sizedFields[tooLargeField]
                    .max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

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
