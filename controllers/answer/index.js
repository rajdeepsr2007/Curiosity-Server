const Answer = require('../../models/answer/');
const Question = require('../../models/question/');
const deleteComment = require('../comment/index').deleteComment;
const fs = require('fs');
const path = require('path');
const Vote = require('../../models/votes/votes');
const uploadImages = require('../../models/answer/images-upload');
const User = require('../../models/user/index');

module.exports.addAnswer = async (req,res) => {
    try{
        const user = await User.findById(req.user._id);
        uploadImages( req , res , async function(err){

            const { questionId , description } = req.body;
            const answer = await Answer.create({
                user : req.user._id ,
                question : questionId, 
                upvotes : 0 ,
                downvotes : 0 ,
            })

            const fileName = answer._id + '.json';
            answer.description = fileName ;
            await answer.save();

            fs.writeFileSync(path.join(__dirname , '..' ,'..', 'data' , 'answers' , fileName) , description , {flags : 'w+'} );

            const question = await Question.findById(questionId);
            question.answers.push(answer._id);
            await question.save();

            user.answers.push(answer._id);
            await user.save();

            if( req.files && req.files.length > 0 ){
                answer.images = req.files.map( file => {
                    return path.join('/uploads' , 'answers' , file.filename )
                } )
                await answer.save();
            }    
        } )

        return res.status(200).json({
            message : 'Answer Created',
            success : true
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.getAnswers = async (req,res) => {
    try{
        const {questionId} = req.body;
        const question = await Question.findById(questionId)
                        .populate({ path : 'answers' , populate : { path : 'user' } })
        const answers = question.answers;
        for( const answer of answers ){
            answer.description = fs.readFileSync(
                        path.join(__dirname , '..' , '..' , 'data' , 'answers' , answer.description )
                    )
        } 

        const answerObjects = [];

        for( const answer of answers ){
            const vote = await Vote.findOne({ user : req.user._id , answer : answer._id  });
            const answerObject = answer.toJSON();
            if( vote ){
                if( vote.type === 'upvote' ){
                    answerObject['upvoted']  = true 
                }else{
                    answerObject['downvoted'] = true
                }
            }
            answerObjects.push(answerObject);
        }
                
        return res.status(200).json({
            message : "Answers Loaded",
            answers : answerObjects
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}

module.exports.voteAnswer = async (req,res) => {
    try{
        const {answerId , type } = req.body;
        const answer = await Answer.findById(answerId);
        if( answer ){
            const vote = await Vote.findOne({ user : req.user._id , answer : answer });
            if( vote ){
                const voteType = vote.type;
                await vote.remove();
                if( voteType === type ){     
                    if( type === 'upvote' ){
                        answer.upvotes = parseInt( answer.upvotes ) - 1;
                    }else{
                        answer.downvotes = parseInt( answer.downvotes ) - 1;
                    }
                    await answer.save();
                    return res.status(200).json({
                        message : "Vote Removed",
                        success : true
                    })
                }else{
                    const vote = await Vote.create({
                        user : req.user._id ,
                        answer : answer ,
                        type
                    })
                    if( type === 'upvote' ){
                        answer.upvotes = parseInt( answer.upvotes ) + 1;
                        answer.downvotes = parseInt( answer.downvotes ) - 1;
                    }else{
                        answer.upvotes = parseInt( answer.upvotes ) - 1;
                        answer.downvotes = parseInt( answer.downvotes ) + 1;
                    }
                    await answer.save();
                    return res.status(200).json({
                        message : "Vote Inverted",
                        success : true
                    })
                }
            }else{
                const vote = await Vote.create({
                    user : req.user._id ,
                    answer : answer ,
                    type
                })
                if( type === 'upvote' ){
                    answer.upvotes = parseInt( answer.upvotes ) + 1;
                }else{
                    answer.downvotes = parseInt( answer.downvotes ) + 1;
                }
                await answer.save();
                return res.status(200).json({
                    message : "Vote Created",
                    success : true
                })
            }
        }else{
            return res.status(200).json({
                message : "Answer doesn't exist",
                success : true
            })
        }
        
    }catch(error){
        return res.status(500).json({
            message : "Something went wrong"
        }) 
    }
} 

module.exports.deleteAnswer = async (answerId) => {
    const answer = await Answer.findById(answerId);
    if( answer ){
        for( const comment of answer.comments ){
            await deleteComment(comment);
        }
        const user = await User.findById(answer.user);
        if( user ){
            await user.answers.pull(answer._id);
            await user.save();
        }
        await fs.unlinkSync(
            path.join(
                __dirname , '..' , '..' , 'data' , 'answers' , answer.description
            )
        )
        await answer.remove();
    }
    
}