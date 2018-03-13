const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const PresetWordSetSchema = mongoose.Schema({
    name: { type: String, required: true },
    data: [{ type: String, required: true }],
});


PresetWordSetSchema.methods.serialize = function () {
    console.log(this);

    return {
        id: this._id
    };
};

const PresetWordSetModel = mongoose.model('WordSets', PresetWordSetSchema);

module.exports =  PresetWordSetModel ;
