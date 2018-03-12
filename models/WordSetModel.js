const mongoose = require('mongoose');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const PresetWordSetSchema = mongoose.Schema({
    name: { type: String, required: true},
    data: { type: Object, required: true},
});


PresetWordSetSchema.methods.serialize = function () {
    console.log(this);

    return {
        id: this._id
    };
};

const PresetWordSetModel = mongoose.model('Users', PresetWordSetSchema);

module.exports =  PresetWordSetModel ;
