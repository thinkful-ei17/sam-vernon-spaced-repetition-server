'use strict';

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

const jwtAuth = passport.authenticate('jwt', { 'session': false });
const localAuth = passport.authenticate('local', { 'session': false });

const databaseCalls = require('../controllers/userController');

const createAuthToken = function(user) {
    return jwt.sign({ user }, JWT_SECRET, {
        'subject': user.username,
        'expiresIn': JWT_EXPIRY,
        'algorithm': 'HS256'
    });
};

loginRouter.post('/login', localAuth, (req, res) => {
    const authToken = createAuthToken(req.user.serialize());

    res.json({ authToken });
});

loginRouter.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);

    res.json({ authToken });
});

loginRouter.post('/register', (req, res) => {
    const requiredFields = [ 'username', 'firstName', 'lastName', 'email', 'password' ];

    const missingField = requiredFields.find((field) => !(field in req.body));

    const nonStringField = requiredFields.find(
        (field) => field in req.body && typeof req.body[ field ] !== 'string');

    if (missingField) {
        return res.status(422).json({
            'code': 422,
            'reason': 'ValidationError',
            'message': 'Missing field',
            'location': missingField
        });
    }
    if (nonStringField) {
        return res.status(422).json({
            'code': 422,
            'reason': 'ValidationError',
            'message': 'Incorrect field type: expected string',
            'location': nonStringField
        });
    }

    const { firstName, lastName, email, username, password } = req.body;

    return User.find({ username })
        .count()
        .then((count) => {
            if(count > 0) {
                return Promise.reject({
                    'code': 422,
                    'reason': 'ValidationError',
                    'message': 'Username already taken',
                    'location': 'username'
                });
            }

            return User.hashPassword(password);
        })
        .then((digest) => {
            return User.create({
                username,
                'password': digest,
                firstName,
                lastName,
                email
            });
        })
        .then((user) => {
            return res.status(201).json(user.serialize());
        })
        .catch((err) => {
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({ 'code': 500, 'message': 'Internal server error' });
        });
});

module.exports = loginRouter;
