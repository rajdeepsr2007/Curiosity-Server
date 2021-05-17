const allTopics = require('../../config/topics');
const User = require('../../models/user');
const Topic = require('../../models/topic');

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