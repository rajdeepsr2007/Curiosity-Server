const Question = require('../../models/question/index');
const fs = require('fs');
const path = require('path');
const Topic = require('../../models/topic/');
const Space = require('../../models/space/');
const User = require('../../models/user');

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

const filterQuestions = async (filter) => {
    const questionObjects = [];
    if( filter.topics ){
        if( filter.topics.length > 0 ){
            for( let topic of filter.topics ){
                const topicObject = await Topic.findById(topic)
                                                .populate({ path : 'questions' , populate : { path : 'user' } })
                                                .populate({ path : 'questions' , populate : { path : 'topic'} })
                                                .populate({ path : 'questions' , populate : { path : 'space'} })
                                                ;
                const questions = topicObject.questions;
                for( let question of questions ){
                    questionObjects.push({ ...question.toJSON() , user : {...question.toJSON().user , password : null } })
                }
            }
        }
    }
    if( filter.spaces ){
        if( filter.spaces.length > 0 ){
            for( let space of filter.spaces ){
                const spaceObject = await Space.findById(space)
                                                .populate({ path : 'questions' , populate : { path : 'user' } })
                                                .populate({ path : 'questions' , populate : { path : 'topic'} })
                                                .populate({ path : 'questions' , populate : { path : 'space'} })
                                                ;
                const questions = spaceObject.questions;
                for( let question of questions ){
                    questionObjects.push({ ...question.toJSON() , user : {...question.toJSON().user , password : null } })
                }
            }
        }
    }

    for( let question of questionObjects ){
        question.description = JSON.stringify(
            JSON.parse(
                fs.readFileSync(path.join(__dirname , '..' ,'..' ,'data' , 'questions' , question.description))
        ))
    }

    return questionObjects;

}

module.exports.getQuestions = async (req,res) => {
    try{
        let { user } = req;
        const { filter } = req.body;
        let questionObjects = [];

        if( filter){
            questionObjects = await filterQuestions(filter);
            return res.status(200).json({
                message : "Questions Loaded",
                questions : questionObjects ,
                success : true
            })
        }else{
            for( let space of user.spaces ){
                const spaceObject = await Space.findById(space)
                                                .populate({ path : 'questions' , populate : { path : 'user' } })
                                                .populate({ path : 'questions' , populate : { path : 'topic'} })
                                                .populate({ path : 'questions' , populate : { path : 'space'} });
                const questions = spaceObject.questions;
                for( let question of questions ){
                    questionObjects.push({ ...question.toJSON() , user : {...question.toJSON().user , password : null } })
                }
            }
            for( let topic of user.topics ){
                const topicObject = await Topic.findById(topic)
                                                .populate({ path : 'questions' , populate : { path : 'user' } })
                                                .populate({ path : 'questions' , populate : { path : 'topic'} })
                                                .populate({ path : 'questions' , populate : { path : 'space'} });
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
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}