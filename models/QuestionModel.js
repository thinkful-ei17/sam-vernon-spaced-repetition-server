const mongoose = require('mongoose');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const QuestionSchema = mongoose.Schema({
    word: { type: String, required: true },
    prompt: { type: String, required: true },
    correctAnswer: {type: String },
    incorrectAnswers: [
      {type: String } 
    ]
};

QuestionSchema.methods.serialize = function () {
    console.log(this);

    return {
        id: this._id,
    };
};

const QuestionModel = mongoose.model('Questions', QuestionSchema);

module.exports =  QuestionModel ;
