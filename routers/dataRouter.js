'use strict';

const express = require('express');

const dataRouter = express.Router();
const databaseCalls = require('../controllers/dataController');

// get all questions in database
dataRouter.get('/questions', (req, res) => {

    databaseCalls.getQuestions().then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });

});

// get all words in database
dataRouter.get('/wordSets', (req, res) => {

    databaseCalls.getWordSets().then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });

});

// create a question for database
dataRouter.post('/createQuestion', (req, res) => {

    const { word, prompt, correctAnswer, definition, nValue, incorrectAnswers } = req.body;

    databaseCalls.createQuestion(word, prompt, correctAnswer, definition, nValue, incorrectAnswers).then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.send(err);
    });

});

// create a wordSet for database
dataRouter.post('/createWordSet', (req, res) => {

    const { name, data, description } = req.body;

    databaseCalls.createWordSet(name, data, description).then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log('Router error: ', err);
        res.send(err);
    });

});

// delete a question
dataRouter.delete('/questions/:id', (req, res) => {

    // not tested
    databaseCalls.deleteQuestions()
        .then((data) => {
            console.log(data);
            res.json(data);
        }).catch((err) => {
            console.log('Router error: ', err);
            res.send(err.message);
        });

});

// delete all questions
dataRouter.delete('/questions', (req, res) => {

    // not tested
    databaseCalls.deleteQuestions()
        .then((data) => {
            console.log(data);
            res.json(data);
        }).catch((err) => {
            console.log('Router error: ', err);
            res.send(err.message);
        });

});

// delete a wordSet
dataRouter.delete('/wordSets/:id', (req, res) => {
    // not tested

    databaseCalls.deleteWordSets()
        .then((data) => {
            console.log(data);
            res.json(data);
        }).catch((err) => {
            console.log('Router error: ', err);
            res.send(err.message);
        });

});

// delete all wordSets
dataRouter.delete('/wordSets', (req, res) => {
    // not tested

    databaseCalls.deleteWordSets()
        .then((data) => {
            console.log(data);
            res.json(data);
        }).catch((err) => {
            console.log('Router error: ', err);
            res.send(err.message);
        });

});

module.exports = dataRouter;
