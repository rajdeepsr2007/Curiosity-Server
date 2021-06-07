const allTopics = require('../../config/topics');
const User = require('../../models/user');
const Topic = require('../../models/topic');
const uploadPicture = require('../../models/user/picture-upload');
const path = require('path');
const Space = require('../../models/space');
const Follow = require('../../models/follow/follow');

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

module.exports.getUserPicture = async (req,res) => {
    try{
        const user = await User.findById(req.user._id);
        return res.status(200).json({
            message : "Changes Saved",
            success : true ,
            src : user.picture
        })
    }catch(error){
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }
}

module.exports.editPicture = async (req,res) => {
    try{

        let user = await User.findById(req.user._id);
        uploadPicture(req , res , async function(err){
            if( err){
                throw 'Error in uploading picture'
                return
            }
            if(req.file){
                user.picture = path.join('/uploads' , 'avatars/') + req.file.filename
                await user.save();
            }
        })
        return res.status(200).json({
            message : "Changes Saved",
            success : true
        })
    }catch(error){
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.getTopicsSpaces = async (req,res) => {
    try{
        const user = await User.findById(req.user._id).populate('topics').populate('spaces');
        return res.status(200).json({
            message : "User Topics Spaces",
            topics : user.topics ,
            spaces : user.spaces ,
            success : true
        })
    }catch(error){
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

const getFilteredUsers = async (filter) => {
    const userObjects = [];
    if( filter.space_followers ){
        for( const spaceId of filter.space_followers ){
            const space = await Space.findById(spaceId).populate('followers');
            const users = space.followers;
            for( const user of users ){
                userObjects.push(user);
            }
        }
    }
    return userObjects;
}


module.exports.getUsers = async (req,res) => {
    try{
        const {filter , startRange} = req.body;
        let userObjects = await getFilteredUsers(filter);
        const results = userObjects.length;
        userObjects = await spliceUsers( userObjects , startRange );
        const users = [];
        for( let user of userObjects ){
            const follow = await Follow.find({ user : user._id , follower : req.user._id });
            users.push({...user.toJSON() , follow});
        }
        return res.status(200).json({
            message : "Space Users",
            users : users,
            results : results
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

const spliceUsers = async (users , startRange) => {
    const spliceLength = users.length - startRange > 4 ? 5 : users.length - startRange + 1;
    return users.splice( startRange , spliceLength );
}

module.exports.followUser = async (req,res) => {
    try{
        let {user} = req;
        const {userId} = req.body;
        user = await User.findById(user._id);
        const fUser = await User.findById(userId);
        const follow = await Follow.findOne({ user : user._id , follower : userId });
        if( follow ){
            follow.remove();
            user.following.pull(userId);
            await user.save();
            fUser.followers.pull(user._id);
            await fUser.save();
            return res.status(200).json({
                message : "Unfollow",
                success : true
            })
        }else{
            await Follow.create({
                user : userId ,
                follower : user._id
            });
            user.following.push(userId);
            fUser.followers.push(user._id);
            await user.save();
            await fUser.save();
            return res.status(200).json({
                message : "Follow",
                success : true
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}