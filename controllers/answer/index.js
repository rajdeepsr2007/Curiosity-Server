const Answer = require('../../models/answer/');
const Question = require('../../models/question/');
const fs = require('fs');
const path = require('path');

module.exports.addAnswer = async (req,res) => {
    try{
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

        return res.status(200).json({
            message : 'Answer Created',
            success : true
        })

    }catch(error){
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}