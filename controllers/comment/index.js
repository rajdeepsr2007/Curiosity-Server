const Comment = require('../../models/comment/comment');
const Answer = require('../../models/answer/index');
const fs = require('fs');
const path = require('path');

module.exports.addComment = async (req,res) => {
    try{
        const {answerId , description} = req.body;
        const answer = await Answer.findById(answerId);
        if(answer){
            const comment = await Comment.create({
                user : req.user._id ,
                answer : answer._id ,
            }) 
            const fileName = comment._id + '.json';
            comment.description = fileName;
            await comment.save();
            answer.comments.push(comment._id);
            await answer.save();
            fs.writeFileSync(path.join(__dirname , '..','..','data','comments' , fileName) , description , { flags : 'w+' } );

            return res.status(200).json({
                message : "Comment Created",
                success : true ,
                comment : comment
            })

        }else{
            return res.status(200).json({
                message : "Answer doesn't exist",
                success : false
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.getComments = async (req,res) => {
    try{
        const {answerId} = req.body;
        const answer = await Answer.findById(answerId).populate( { path : 'comments' , populate : { path : 'user' } } )
        if(answer){
            for( const comment of answer.comments ){
                comment.description = JSON.stringify(
                        JSON.parse(
                            fs.readFileSync(path.join(__dirname , '..','..','data','comments' , comment.description))
                        )
                    )
            }
    
            return res.status(200).json({
                message : "Answer Comments",
                success : true ,
                comments : answer.comments
            })
        }else{
            return res.status(200).json({
                message : "Answer Doesn't exist",
                success : false
            })
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}