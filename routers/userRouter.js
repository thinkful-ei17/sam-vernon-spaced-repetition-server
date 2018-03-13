'use strict';

require('dotenv').config();
const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

const { jwtStrategy } = require('../strategies/strategies');

const jwtAuth = passport.authenticate('jwt', { 'session': false } );

passport.use(jwtStrategy);

const databaseCalls = require('../controllers/userController');

// get all data about user! even the password [insert evil laugh]
userRouter.get('/', jwtAuth, (req, res) => {

    console.log(req.headers);
    const { user } = req;

    res.json(user);

});

// when user requests for a new question!
userRouter.get('/question', jwtAuth, (req, res) => {

    const { wordSet } = req.query;

    console.log('wordSet', wordSet);
    const { id } = req.user;

    console.log('ID', id);

    databaseCalls.getQuestion(wordSet, id)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log('Router error', err);
            res.send(err.message);
        });

});

// when user answers back to question
userRouter.post('/response', jwtAuth, (req, res) => {
    res.send('template!');

});

// get specific wordSet to quiz on!
userRouter.get('/wordSet', jwtAuth, (req, res) => {
    res.send('template!');

});

module.exports = userRouter;
