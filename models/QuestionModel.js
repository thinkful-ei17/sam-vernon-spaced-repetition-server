'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const QuestionSchema = mongoose.Schema({
    'word': { 'type': String, 'required': true },
    'prompt': { 'type': String, 'required': true },
    'correctAnswer': { 'type': String },
    'incorrectAnswers': [
        { 'type': String }
    ],
    'nValue': { 'type': Number, 'required': true }
});

QuestionSchema.methods.serialize = function() {

    return {
        'id': this._id,
        'word': this.word,
        'prompt': this.prompt,
        'correctAnswer': this.correctAnswer,
        'incorrectAnswers': this.incorrectAnswers
    };
};

const QuestionModel = mongoose.model('Questions', QuestionSchema);

module.exports = QuestionModel ;
