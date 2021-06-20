const Poll = require('../../models/poll/poll');
const Option = require('../../models/poll/option/option');

module.exports.addPoll = async (req,res) => {
    try{
        const {poll} = req.body;
        const {user} = req;
        const pollId = (Math.ceil(Math.random()*1000000)).toString();
        const pollObject = await Poll.create({
            user : user._id,
            description : poll.description ,
            votes : 0 ,
            pid : pollId
        })
        for( const option of poll.options ){
            const optionObject = await Option.create({
                poll : pollObject._id ,
                title : option.title ,
                votes : 0
            })
            pollObject.options.push(optionObject._id);
        }
        await pollObject.save();
        return res.status(200).json({
            message : 'Poll created',
            _id : pollId
        })
    }catch(error){
        
    }
}

module.exports.getPoll = async (req,res) => {
    try{
        const pollId = req.params.id;
        const poll = await Poll.findOne({ pid : pollId }).populate('user').populate('options');
        if( poll ){
            return res.status(200).json({
                message : 'Poll loaded',
                poll : poll,
                success : true
            })
        }else{
            return res.status(200).json({
                message : "Poll doesn't exist",
                poll : poll ,
                success : false
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }
}
