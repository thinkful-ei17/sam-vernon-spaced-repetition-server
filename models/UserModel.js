'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    'username': { 'type': String, 'required': true },
    'password': { 'type': String, 'required': true },
    'firstName': { 'type': String },
    'lastName': { 'type': String },
    'email': { 'type': String },
    'wordSets': [ {
        'name': { 'type': String, 'required': true },
        'data': { 'type': Object, 'required': true },
        'description': { 'type': String, 'required': true },
        'mastery': { 'type': Number, 'required': true }
    } ]
});

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    console.log(password);
    return bcrypt.hash(password, 10);
};

UserSchema.methods.serialize = function() {

    return {
        'id': this._id,
        'username': this.username,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'email': this.email,
        'wordSets': this.wordSets.map(( aSet ) => {
            return {
                'id': aSet._id,
                'name': aSet.name,
                'data': aSet.data,
                'description': aSet.description,
                'mastery': aSet.mastery
            };
        })
    };
};

const UserModel = mongoose.model('Users', UserSchema);

module.exports = UserModel ;
