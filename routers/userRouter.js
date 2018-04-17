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

    const { id } = req.user;

    databaseCalls.getUser(id)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err.message);
        });

});

// when user requests for a new question!
userRouter.get('/question', jwtAuth, (req, res) => {

    const { wordSet } = req.query;
    const { id } = req.user;

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
    const { wordSet } = req.query;
    const { answer } = req.body;
    const { id } = req.user;

    databaseCalls.response(wordSet, answer, id)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err.message);
        });

});

// upsert specific wordSet to quiz on!
userRouter.put('/wordSet', jwtAuth, (req, res) => {

    const { wordSet } = req.query;
    const { id } = req.user;

    databaseCalls.upsertWordSet(wordSet, id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err.message);
        });

});

userRouter.get('/wordSet', jwtAuth, (req, res) => {

    const { wordSet } = req.query;
    const { id } = req.user;

    databaseCalls.getWordSet(wordSet, id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err.message);
        });

});

// get all wordSets
userRouter.get('/wordSets', jwtAuth, (req, res) => {

    const { id } = req.user;

    databaseCalls.getWordSets(id)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err.message);
        });

});

// delete all wordsets of user
userRouter.delete('/wordSets', jwtAuth, (req, res) => {

    const { id } = req.user;

    databaseCalls.deleteAllWordSets(id)
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err.message);
        });
});

module.exports = userRouter;
