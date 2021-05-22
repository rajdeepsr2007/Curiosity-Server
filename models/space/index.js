const mongoose = require('mongoose');

const spaceSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    topic : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Topic',
        required : true
    },
    background : {
        type : String
    },
    questions : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Question' 
        }
    ],
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
},{
    timestamps : true
})

const Space = mongoose.model('Space',spaceSchema);

module.exports = Space;