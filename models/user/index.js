const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String ,
        required : true
    },
    password : {
        type : String ,
        required : true
    },
    firstLogin : {
        type : Boolean ,
        required : true
    },
    topics : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Topic'
        }
    ],
    picture : {
        type : String,
        required : true
    },
    spaces : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Space'
        }
    ],
    questions : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'Question'
        }
    ],
    answers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Answer'
        }
    ],
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : 'User'
        }
    ]
},{
    timestamps : true
})

const User = mongoose.model('User',userSchema);

module.exports = User;