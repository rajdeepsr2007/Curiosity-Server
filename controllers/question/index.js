const Question = require('../../models/question/index');
const fs = require('fs');
const path = require('path');

module.exports.addQuestion = async (req,res) => {
    try{
        const { title , topic , space , badges , description } = req.body;
        const question = await Question.create({
            user : req.user._id,
            title : title ,
            topic : topic ,
            space : space ,
            badges : badges ,
        });

        const fileName = question._id + '.json';
        question.description = fileName;
        await question.save();
       
        fs.writeFileSync(path.join(__dirname , '..','..','data','questions' , fileName) , description , { flags : 'w+' } );

        return res.status(200).json({
            message : 'Question created',
            success : true
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}