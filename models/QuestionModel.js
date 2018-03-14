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
    'definition': { 'type': String, 'required': true },
    'nValue': { 'type': Number, 'required': true, 'default': 1 },
    'score': { 'type': Number, 'required': true, 'default': 0 }
});

QuestionSchema.methods.serialize = function() {

    return {
        'id': this._id,
        'word': this.word,
        'prompt': this.prompt,
        'correctAnswer': this.correctAnswer,
        'definition': this.definition,
        'incorrectAnswers': this.incorrectAnswers,
        'nValue': this.nValue,
        'score': this.score
    };
};

const QuestionModel = mongoose.model('Questions', QuestionSchema);

module.exports = QuestionModel ;
