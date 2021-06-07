const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    },
    follower : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User',
        required : true
    }
},{
    timestamps : true
})

const Follow = mongoose.model('Follow',followSchema);

module.exports = Follow;