const WordSetModel = require('../models/WordSetModel');
const QuestionModel = require('../models/QuestionModel');

module.exports = {
    getQuestions: function () {
        return QuestionModel.find()
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    },
    getWordSets: function () {
        return WordSetModel.find()
            .then(data => {
                console.log(data);
                return data;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    },
    createQuestion: function (word, prompt, correctAnswer, incorrectAnswers) {
        return QuestionModel.create({
            word,
            prompt,
            correctAnswer,
            incorrectAnswers
        })
            .then(data => {
                console.log('CREATED QUESTION');
                console.log(data);
                return data;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    },
    createWordSet: function (name, data) {
        return WordSetModel.create({
            name,
            data
        })
            .then(data => {
                console.log('CREATED QUESTION');
                console.log(data);
                return data;
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    }
};
