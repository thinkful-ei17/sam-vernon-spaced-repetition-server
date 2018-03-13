const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;


const UserSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName : { type: String },
    lastName: { type: String },
    wordSets: [{
      name: { type: String, required: true },
      data: { type: Object, required: true },
      description: { type: String, required: true },
      mastery: { type: Number, required: true },
    }]
});

UserSchema.methods.validatePassword = function(password){
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password){
    console.log(password);
    return bcrypt.hash(password, 10);
};

UserSchema.methods.serialize = function () {

    return {
        id: this._id,
        username: this.username,
        password: this.password,
        firstName : this.firstName,
        lastName: this.lastName,
        wordSets: this.wordSets
    };
};

const UserModel = mongoose.model('Users', UserSchema);

module.exports =  UserModel ;
