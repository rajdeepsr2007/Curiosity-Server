const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
    answer : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true
    },
    description : {
        type : String ,
    }
},{
    timestamps : true
})

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;