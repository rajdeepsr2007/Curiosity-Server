const mongoose = require('mongoose');
const pollVoteSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    poll : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Poll'
    },
    option : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Option'
    }
},{
    timestamps : true
})

const PollVote = mongoose.model('PollVote' , pollVoteSchema);

module.exports = PollVote;