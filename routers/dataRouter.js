const express = require('express');

const dataRouter = express.Router();
const databaseCalls = require('../controller/dataController');

dataRouter.get('/questions', (req, res) => {


});

dataRouter.get('/wordSets', (req, res) => {


});

dataRouter.post('/createQuestion', (req, res) => {


});

dataRouter.post('/createWordSet', (req, res) => {


});



module.exports = dataRouter;
