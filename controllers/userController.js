'use strict';

const UserModel = require('../models/UserModel');
const WordSetModel = require('../models/WordSetModel');
const QuestionModel = require('../models/QuestionModel');

const dataController = require('./dataController');
const { LinkedList } = require('./linkedList');

const createLinkedListForDataField = function(questions) {
    const linkedList = new LinkedList();

    questions.forEach((question) => {
        linkedList.insertFirst(question);
    });

    linkedList.display();
    return linkedList;
};

module.exports = {
    'getQuestion': function(wordSet, id) {
        let description;
        let name;
        let questions;

        return UserModel.findById(id)
            .then((data) => {

                const foundWordSet = data.wordSets.find((set) => set.name === wordSet);

                if (!foundWordSet) {
                    // get the wordSet
                    return dataController.getWordSet(wordSet)
                        .then((aSet) => {
                            // if it doesnt exist
                            if (aSet.length === 0) {
                                throw new Error('No such wordset');
                            }
                            console.log(aSet);
                            console.log('==========wordSet data===========', aSet[ 0 ]);
                            name = aSet[ 0 ].name;
                            description = aSet[ 0 ].description;

                            // get questions mentioned in wordSet
                            return dataController.getQuestionsById(aSet[ 0 ].data);
                        })
                        .then((questionsData) => {
                            console.log(questionsData);
                            questions = questionsData;
                            // create userWordSet
                            return this.createWordSet(name, description, questions, id);
                        })
                        .then((data) => {
                            console.log('created!?');
                            console.log(data);

                            let foundWordSet = data.wordSets.find((set) => set.name === wordSet);

                            return foundWordSet.data.head.value;
                        });

                }

                // else: if foundWordSet was actually found
                // its a linkedList w/ a head, nodes & values
                return foundWordSet.data.head.value;

                // return data.serialize();
            });

    },
    'getWordSets': function(id) {

    },
    'response': function(wordSet, answer, id) {
        return UserModel.findById(id)
            .then((data) => {

                const foundWordSet = data.wordSets.find((set) => set.name === wordSet);

                if (!foundWordSet) {
                    throw new Error('No such word-set.');
                }

                const decision = answer;

                /*
                  algo: down here

                */

                console.log('DECISION', decision);
                console.log(foundWordSet);

                if (decision) {
                  console.log('CONDITION PASSED')
                    // increment
                    const oldQuestion = foundWordSet.data.removeHead();

                    foundWordSet.data.insertLast(oldQuestion);
                } else {
                    // decrement
                    const oldQuestion = foundWordSet.data.removeHead();

                    foundWordSet.data.insertLast(oldQuestion);
                }
            });


    },
    'createWordSet': function(name, description, questions, id) {
        return UserModel.findById(id)
            .then((data) => {
                let newWordSet = {
                    name,
                    'data': createLinkedListForDataField(questions),
                    description,
                    'mastery': 0
                };

                console.log('NEWWORDSET', newWordSet);
                console.log('response: ', data);
                data.wordSets = [ ...data.wordSets, newWordSet ];

                return data.save();
            })
            .catch((err) => {
                console.log(err.message);
                return err;
            });
    }
};
