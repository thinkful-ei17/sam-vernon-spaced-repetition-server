const mongoose = require('mongoose');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const UserSchema = mongoose.Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    firstName : {type: String},
    lastName: {type: String},
    wordSets: [{
      name: { type: String, required: true},
      data: { type: Object, required: true},
      mastery: { type: Number, required: true},
    }]
});


UserSchema.methods.serialize = function () {
    console.log(this);

    return {
        id: this._id,
        username: this.username,
        password: this.password,
    };
};

const UserModel = mongoose.model('Users', UserSchema);

module.exports =  UserModel ;
