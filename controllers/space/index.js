const Space = require('../../models/space/index');
const Topic = require('../../models/topic/index');
const backgroundUpload = require('../../models/space/background-upload');
const path = require('path');
const User = require('../../models/user');

module.exports.addSpace = async (req,res) => {
    try{
           backgroundUpload(req , res , async (err) => {
                const { title , topic } = req.body;
                let space = await Space.findOne({ title : title , topic : topic });
                if( space ){
                    return res.status(200).json({
                        message : `Space ${title} under same topic exists`,
                        success : false
                    })
                }else{
                    space = await Space.create({
                        title : title,
                        topic : topic ,
                        background : path.join('/uploads','backgrounds/') + req.file.filename,
                    })
                   
                    return res.status(200).json({
                        message : `Space ${title} created`,
                        success : true
                    })
                }
           }) 
    }catch(error){
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.getSpaces = async (req,res) => {
    try{
        let spaces;
        const {filter} = req.body;
        const spaceObjects = [];
        if( filter ){
            if( filter.follow){
                for( const userId of filter.follow ){
                    const userObject = await User.findById(userId).populate({ path : 'spaces' , populate : { path : 'topic' } });
                    for( const space of userObject.spaces ){
                        let spaceObject = space.toJSON();
                        spaceObject.follow = false;
                        for( const spaceId of req.user.spaces ){
                            if( JSON.stringify(spaceId) === JSON.stringify(spaceObject._id) ){
                                spaceObject.follow = true;
                            }
                        }
                        spaceObjects.push(spaceObject);
                    }
                }
            }
        }else{
            spaces = await Space.find();
            for( let space of spaces ){
                const spaceObject = space.toJSON();
                const topic =  await Topic.findById(space.topic);
                let follow = false;
                for( let space of req.user.spaces ){
                    
                    if( JSON.stringify(space) === JSON.stringify(spaceObject._id) ){
                        follow  = true;
                        break;
                    }
                }
                spaceObjects.push({...spaceObject , topic : {title : topic.title} , follow : follow});
            }
        }

        const results = spaceObjects.length;
        const resSpaces = await spliceSpaces(spaceObjects , req.body.startRange);
        
        return res.status(200).json({
            message : "Spaces loaded",
            spaces : resSpaces,
            results
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.followSpace = async (req,res) => {
    try{
        const {spaceId} = req.body;
        let isFollowing = false;
        const user = await User.findById(req.user._id);
        const space = await Space.findById(spaceId);
        for( let space of user.spaces ){
            if( JSON.stringify(space) === JSON.stringify(spaceId) ){
                isFollowing = true;
                break;
            }
        }
        if( isFollowing ){
            await user.spaces.pull(spaceId);
            await user.save();
            await space.followers.pull(user._id);
            await space.save();
            return res.status(200).json({
                message : "Space Unfollowed",
                success : true,
                followed : false
            })
        }else{
            await user.spaces.push(spaceId);
            await user.save();
            await space.followers.push(user._id);
            await space.save();
            await space.save();
            return res.status(200).json({
                message : "Space Followed",
                success : true,
                followed : true
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.getSpacesByTopic = async (req,res) => {
    try{
        const spaces = await Space.find({ topic : req.body.topic });
        return res.status(200).json({
            message : `Spaces under topic ${req.body.topic}`,
            spaces : spaces
        })
    }catch(error){
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

const spliceSpaces = async (spaces , startRange) => {
    const spliceLength = spaces.length - startRange >= 4 ? 5 : spaces.length - startRange + 1;
    return spaces.splice(startRange , spliceLength); 
}