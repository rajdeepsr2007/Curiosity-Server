const Question = require('../../models/question/index');
const fs = require('fs');
const path = require('path');
const Topic = require('../../models/topic/');
const Space = require('../../models/space/');

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

        const topicdb = await Topic.findById(topic);
        await topicdb.questions.push(question._id);
        await topicdb.save();

        const spacedb = await Space.findById(space);
        await spacedb.questions.push(question._id);
        await spacedb.save();

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

module.exports.getQuestions = async (req,res) => {
    try{
        const { user } = req;
        const questionObjects = [];
        for( let space of user.spaces ){
            const spaceObject = await Space.findById(space).populate({ path : 'questions' , populate : { path : 'user' } });
            const questions = spaceObject.questions;
            for( let question of questions ){
                questionObjects.push({ ...question.toJSON() , user : {...question.toJSON().user , password : null } })
            }
        }
        for( let topic of user.topics ){
            const topicObject = await Topic.findById(topic).populate({ path : 'questions' , populate : { path : 'user' } });
            const questions = topicObject.questions;
            for( let question of questions ){
                questionObjects.push({ ...question.toJSON() , user : {...question.toJSON().user , password : null } })
            }
        }
        //console.log(questionObjects);
        for( let question of questionObjects ){
            question.description = JSON.stringify(
                JSON.parse(
                    fs.readFileSync(path.join(__dirname , '..' ,'..' ,'data' , 'questions' , question.description))
            ))
        }
        return res.status(200).json({
            message : "Questions Loaded",
            questions : questionObjects ,
            success : true
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}