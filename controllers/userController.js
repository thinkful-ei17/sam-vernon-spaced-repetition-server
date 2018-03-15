'use strict';

const UserModel = require('../models/UserModel');
const WordSetModel = require('../models/WordSetModel');
const QuestionModel = require('../models/QuestionModel');

const dataController = require('./dataController');
const { LinkedList, removeHead, insertAt, insertLast, display, giveLength } = require('./linkedList');

const masteryChecker = 4;

const createLinkedListForDataField = function(questions) {
    const linkedList = new LinkedList();

    questions.forEach((question) => {
        linkedList.insertFirst(question);
    });

    linkedList.display();
    return linkedList;
};

module.exports = {
    'getUser': function(id) {
        return UserModel.findById(id)
            .then((user) => {
                return user.serialize();
            });
    },
    'getQuestion': function(wordSet, id) {
        let description;
        let name;
        let questions;

        return UserModel.findById(id)
            .then((user) => {

                const foundWordSet = user.wordSets.find((set) => set.name === wordSet);

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
                        .then((user) => {
                            console.log('created!?');
                            console.log(user);

                            let foundWordSet = user.wordSets.find((set) => set.name === wordSet);

                            return foundWordSet.data.head.value;
                        });

                }

                // else: if foundWordSet was actually found
                // its a linkedList w/ a head, nodes & values
                return foundWordSet.data.head.value;

                // return data.serialize();
            });

    },
    'getWordSet': function(wordSet, id) {
        console.log('given name:', wordSet);

        return UserModel.findById(id)
            .then((user) => {

                const foundWordSet = user.wordSets.find((set) => set.name === wordSet);

                if (!foundWordSet) {
                    throw new Error('No such word-set!');
                }

                return foundWordSet;
            });
    },
    'getWordSets': function(id) {

    },
    'response': function(wordSet, answer, id) {
        return UserModel.findById(id)
            .then((user) => {

                const foundWordSet = user.wordSets.find((set) => set.name === wordSet);

                if (!foundWordSet) {
                    throw new Error('No such word-set on user.');

                // logic to remove answered Question from foundWordSet & switch to a new one
                } else if (answer) {
                    // increment -- answer they gave is right!
                    console.log('======= ID: ', foundWordSet.id);

                    // console.log('===== before changes =====');
                    // display(foundWordSet.data.head);
                    // console.log('===== before changes =====');

                    // saving oldQ for insertLast
                    const oldQuestion = foundWordSet.data.head.value;

                    // increment oldQ nValue since answer was correct
                    const isItBiggerThanLinkedList = oldQuestion.nValue > giveLength(foundWordSet.data.head);

                    oldQuestion.nValue = isItBiggerThanLinkedList ? giveLength(foundWordSet.data.head) : oldQuestion.nValue * 2;

                    // increment score of question
                    oldQuestion.score = oldQuestion.score === 100 ? 100 : oldQuestion.score + 1;

                    // LinkedList aka head = updatedVersion & im removing the top
                    foundWordSet.data.head = removeHead(foundWordSet.data.head);

                    // LinkedList aka head = updatedVersion & im adding to the bottom
                    foundWordSet.data.head = insertAt(oldQuestion, foundWordSet.data.head);

                    // check when2change mastery when one oldQuestion reaches a score over 80
                    if (oldQuestion.score > masteryChecker) {
                        console.log('SCORE BIGGER ============');
                        this.updateMastery(foundWordSet);
                    }

                    // console.log('===== after changes - if true =====');
                    // display(foundWordSet.data.head);
                    // console.log('===== after changes - if true =====');

                } else {
                    // decrement -- answer they gave is wrong!
                    // console.log('===== before changes =====');
                    // display(foundWordSet.data.head);
                    // console.log('===== before changes =====');

                    // saving oldQ for insertLast
                    const oldQuestion = foundWordSet.data.head.value;

                    // decrement score of question
                    // cant increase over 100 or under 0
                    oldQuestion.score = oldQuestion.score === 0 ? 0 : oldQuestion.score - 1;

                    // decrement oldQ nValue since answer was incorrect
                    oldQuestion.nValue = 1;

                    // LinkedList aka head = updatedVersion & im removing the top
                    foundWordSet.data.head = removeHead(foundWordSet.data.head);

                    // LinkedList aka head = updatedVersion & im adding to the bottom
                    foundWordSet.data.head = insertAt(oldQuestion, foundWordSet.data.head);

                    // check when2change mastery when one oldQuestion reaches a score over 80
                    if (oldQuestion.score > 80) {
                        this.updateMastery(foundWordSet);
                    }

                    // console.log('===== after changes if false =====');
                    // display(foundWordSet.data.head);
                    // console.log('===== after changes if false =====');
                }

                /*
                  replacing oldWordSet w/ changes made in foundWordSet
                  > making/returning A NEW OBJECT IS IMPORTANT.
                  > [return foundWordSet] DOES NOT WORK
                  >> mongoose wont detect changes. even though logs show it.
                  > making a new arr w/ [...newWordSets] doesnt help.
                */
                const newWordSets = user.wordSets.map((aSet) => {
                    // console.log('bool statement: ', aSet.id === foundWordSet.id);
                    if (aSet.id === foundWordSet.id) {
                        console.log('Found it, so Im replacing it.');

                        const { name, data, description, mastery, id } = foundWordSet;

                        return {
                            id,
                            name,
                            data,
                            description,
                            mastery
                        };
                    }


                });

                user.wordSets = newWordSets;
                console.log('NEW DATA.WORDSETS', JSON.stringify(newWordSets, null, 2));

                return user.save();
            });

    },
    'createWordSet': function(name, description, questions, id) {
        return UserModel.findById(id)
            .then((user) => {
                let newWordSet = {
                    name,
                    'data': createLinkedListForDataField(questions),
                    description,
                    'mastery': 0,
                    'score': 1
                };

                console.log('NEWWORDSET', newWordSet);
                console.log('response: ', user);
                user.wordSets = [ ...user.wordSets, newWordSet ];

                return user.save();
            })
            .catch((err) => {
                console.log(err.message);
                return err;
            });
    },
    'deleteAllWordSets': function(id) {
        return UserModel.findById(id)
            .then((user) => {
                user.wordSets = [];
                return user.save();
            });
    },
    'updateMastery': function(wordSet) {
        console.log('---------------curr mastery: ', wordSet.mastery);

        let total = 0;
        let mastered = 0;
        let current = wordSet.data.head;

        // traverse thru data
        while (current != null) {
            total += 1;

            console.log('mastery, curr: ', current.value);
            if(current.value.score > masteryChecker) {
                mastered += 1;
            }

            current = current.next;
        }

        console.log('-----------mastered, total----------', mastered, total);
        wordSet.mastery = (mastered / total).toFixed(2) * 100;
        console.log('----------wordset mastery', wordSet.mastery);

    }
};
