const mongoose = require('mongoose');
const optionSchema = new mongoose.Schema({
    poll : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Poll'
    },
    title : {
        type : String
    },
    votes : {
        type : String
    }
},{
    timestamps : true
})

const Option = mongoose.model('Option' , optionSchema);

module.exports = Option;