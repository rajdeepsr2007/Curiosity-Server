const mongoose = require('mongoose');
const pollSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    description : {
        type : String
    },
    options : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Option'
        }
    ],
    votes : {
        type : String
    },
    pid : {
        type : String
    }
},{
    timestamps : true
})

const Poll = mongoose.model('Poll' , pollSchema);

module.exports = Poll;