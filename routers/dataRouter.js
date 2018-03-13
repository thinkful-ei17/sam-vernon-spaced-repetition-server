'use strict';

const express = require('express');

const dataRouter = express.Router();
const databaseCalls = require('../controllers/dataController');

dataRouter.get('/questions', (req, res) => {

    databaseCalls.getQuestions().then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });

});

dataRouter.get('/wordSets', (req, res) => {

    databaseCalls.getWordSets().then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });

});

dataRouter.post('/createQuestion', (req, res) => {

    const {word, prompt, correctAnswer, incorrectAnswers} = req.body;

    databaseCalls.createQuestion(word, prompt, correctAnswer, incorrectAnswers).then(data => {
        console.log(data);
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.send(err);
    });

});

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

module.exports = dataRouter;
