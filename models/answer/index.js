const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    question : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Question',
        required : true

    },
    description : {
        type : String,
    },
    upvotes : {
        type : String,
        required : true
    },
    downvotes : {
        type : String,
        required : true
    },
    images : [
        {
            type : String
        }
    ],
    comments : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Comment'
        }
    ]
},{
    timestamps : true
})

const Answer = mongoose.model('Answer',answerSchema);

module.exports = Answer;