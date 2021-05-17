const allTopics = require('../../config/topics');
const User = require('../../models/user');
const Topic = require('../../models/topic');

module.exports.editTopics = async (req,res) => {
    try{
        const { topics } = req.body;
        const user = await User.findById(req.user._id);
        if( user ){
            for( let i = user.topics.length - 1 ; i >= 0 ; i-- ){
                user.topics.pull(user.topics[i]);
            }
            for( let i = 0 ; i < topics.length ; i++ ){
                if( topics[i].selected ){
                    user.topics.push( topics[i]._id )
                }
            }
            await user.save();
        }
        return res.status(200).json({
            message : 'Changes Saved',
            success : true
        })
    }catch(err){
        return res.status(500).json({
            message : 'Something Went Erong'
        })
    }
}





module.exports.getAllTopics = async (req , res) => {
    try{
        let topics = await Topic.find();
        if( !topics || topics.length == 0){
            for( let i = 0; i < allTopics.length ; i++ ){
                await Topic.create({
                    title : allTopics[i].description, 
                    image : allTopics[i].image
                })
            }
            topics = await Topic.find();
        }
        return res.status(200).json({
            topics : topics
        })
    }catch(error){
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }
}