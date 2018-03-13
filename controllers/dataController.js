'use strict';
const WordSetModel = require('../models/WordSetModel');
const QuestionModel = require('../models/QuestionModel');

module.exports = {
    'getQuestions': function() {
        return QuestionModel.find()
            .then((data) => {
                console.log(data);
                return data.map((question) => question.serialize());
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    'getQuestionsById': function(ids) {
        console.log('ids given', ids);
        return QuestionModel.find({ '_id': { '$in': ids } })
            .then((data) => {
                console.log(data);
                return data.map((question) => question.serialize());
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    'getWordSets': function() {
        return WordSetModel.find()
            .then((data) => {
                console.log(data);
                return data.map((wordSet) => wordSet.serialize());
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    'getWordSet': function(name) {
        return WordSetModel.find({ name })
            .then((data) => {
                console.log(data);
                return data.map((wordSet) => wordSet.serialize());
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    'createQuestion': function(word, prompt, correctAnswer, incorrectAnswers) {
        return QuestionModel.create({
            word,
            prompt,
            correctAnswer,
            incorrectAnswers
        })
            .then((data) => {
                console.log('CREATED QUESTION');
                console.log(data);
                return data.serialize();
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    },
    'createWordSet': function(name, data, description) {
        return WordSetModel.create({
            name,
            data,
            description
        })
            .then((data) => {
                console.log('CREATED QUESTION');
                console.log(data);
                return data.serialize();
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    }
};
