const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User'
    },
    title : {
        type : String ,
        required : true
    },
    topic : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Topic',
        required : true,
    },
    space : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Space',
        required : true
    },
    description : {
        type : String ,
    },
    badges : [
        {
            type : String
        }
    ],
    answers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Answer'
        }
    ]
},{
    timestamps : true
})

const Question = mongoose.model('Question',questionSchema);

module.exports = Question;