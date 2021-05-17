const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    questions : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Question'
        }
    ]
},{ timestamp : true })

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;