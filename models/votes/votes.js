const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true
    },
    answer : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Answer',
        required : true
    },
    type : {
        type : String ,
        required : true
    }
})

const Vote = mongoose.model('Vote' , voteSchema);

module.exports = Vote;