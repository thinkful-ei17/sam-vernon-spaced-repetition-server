'use strict';

const UserModel = require('../models/UserModel');
const WordSetModel = require('../models/WordSetModel');
const QuestionModel = require('../models/QuestionModel');

const dataController = require('./dataController');
const { LinkedList, removeHead, insertAt, insertLast, display, giveLength } = require('./linkedList');

const masteryChecker = 2;

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
        return UserModel.findById(id)
            .then((user) => {

                const foundWordSet = user.wordSets.find((set) => {
                    if (set.name === wordSet) {
                        return set;
                    }
                });

                if (!foundWordSet) {
                    throw new Error('No such word-set!');
                }

                // else: if foundWordSet was actually found
                // its a linkedList w/ a head, nodes & values
                return foundWordSet.data.head.value;
            });

    },
    'getWordSet': function(wordSet, id) {
        // console.log('given name:', wordSet);
        let description;
        let name;
        let questions;

        return UserModel.findById(id)
            .then((user) => {

                let foundWordSet = user.wordSets.find((set) => set.name === wordSet);

                if (!foundWordSet) {
                    return dataController.getWordSet(wordSet)
                        .then((aSet) => {
                        // if it doesnt exist
                            if (aSet.length === 0) {
                                throw new Error('No such wordset');
                            }
                            name = aSet[ 0 ].name;
                            description = aSet[ 0 ].description;

                            // get questions mentioned in wordSet
                            return dataController.getQuestionsById(aSet[ 0 ].data);
                        })
                        .then((questionsData) => {
                        // console.log(questionsData);
                            questions = questionsData;
                            // create userWordSet
                            return this.createWordSet(name, description, questions, id);
                        })
                        .then((updatedUser) => {
                            return updatedUser;
                        });
                }
                return user;
                
            });
    },
    'upsertWordSet': function(wordSet, id) {
        let description;
        let name;
        let questions;

        return UserModel.findById(id)
            .then((user) => {

                let foundWordSet = user.wordSets.find((set) => set.name === wordSet);

                if (!foundWordSet) {
                    return dataController.getWordSet(wordSet)
                        .then((aSet) => {
                        // if it doesnt exist
                            if (aSet.length === 0) {
                                throw new Error('No such wordset');
                            }
                            name = aSet[ 0 ].name;
                            description = aSet[ 0 ].description;

                            // get questions mentioned in wordSet
                            return dataController.getQuestionsById(aSet[ 0 ].data);
                        })
                        .then((questionsData) => {
                        // console.log(questionsData);
                            questions = questionsData;
                            // create userWordSet
                            return this.createWordSet(name, description, questions, id);
                        })
                        .then((updatedUser) => {
                            return updatedUser;
                        });
                }
                return user;

            });
    },
    'getWordSets': function(id) {
        return UserModel.findById(id)
            .then((user) => {
                return user.serialize().wordSets;
            });
    },
    'response': function(wordSet, answer, id) {
        return UserModel.findById(id)
            .then((user) => {

                const foundWordSet = user.wordSets.find((set) => {
                    if (set.name === wordSet) {
                        return set;
                    }
                    return false;
                });

                if (!foundWordSet) {
                    throw new Error('No such word-set on user.');

                // logic to remove answered Question from foundWordSet & switch to a new one
                } else if (answer) {

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

                    // check when2change mastery when one oldQuestion reaches a score over 2
                    this.updateMastery(foundWordSet);

                } else {
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

                    // check when2change mastery when one oldQuestion reaches a score over 2
                    this.updateMastery(foundWordSet);

                }

                /*
                  replacing oldWordSet w/ changes made in foundWordSet
                  > making/returning A NEW OBJECT IS IMPORTANT.
                  > [return foundWordSet] DOES NOT WORK
                  >> mongoose wont detect changes. even though logs show it.
                  > making a new arr w/ [...newWordSets] doesnt help.
                */
                const newWordSets = user.wordSets.map((aSet) => {
                    // // console.log('bool statement: ', aSet.id === foundWordSet.id);
                    if (aSet.id === foundWordSet.id) {
                        // console.log('Found it, so Im replacing it.');

                        const { name, data, description, mastery } = foundWordSet;

                        return {
                            name,
                            data,
                            description,
                            mastery
                        };
                    }
                        
                    return ({ aSet });
                    
                });

                user.wordSets = newWordSets;

                return user.save();
            });

    },
    'createWordSet': function(name, description, questions, id) {
        return UserModel.findByIdAndUpdate(
            id,
            {
                '$push': {
                    'wordSets': {
                        name,
                        'data': createLinkedListForDataField(questions),
                        description,
                        'mastery': 0,
                        'score': 1
                    }
                }
            },
            { 'new': true }
        )
            .then((user) => {
                res.json(user);
            })
            .catch((err) => {
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
        let total = 0;
        let mastered = 0;
        let current = wordSet.data.head;

        // traverse thru data
        while (current != null) {
            total += 1;
            if(current.value.score > masteryChecker) {
                mastered += 1;
            }
            current = current.next;
        }

        wordSet.mastery = Math.round((mastered / total).toFixed(2) * 100);
    }
};
