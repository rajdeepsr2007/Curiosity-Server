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



const getFilteredQuestions = async (filter) => {
    const questionObjects = [];
    if( filter.topics ){
        if( filter.topics.length > 0 ){
            for( let topic of filter.topics ){
                const questions = await getQuestionsByTopic(topic);
                for( let question of questions ){
                    questionObjects.push(question);
                }
            }
        }
    }
    if( filter.spaces ){
        if( filter.spaces.length > 0 ){
            for( let space of filter.spaces ){
                const questions = await getQuestionsBySpace(space);
                for( let question of questions ){
                    questionObjects.push(question);
                }
            }
        }
    }
    return questionObjects;
}



const getQuestionsBySpace = async (space) => {
    let questionObjects = []
    const spaceObject = await Space.findById(space)
                                        .populate({ path : 'questions' , populate : { path : 'user' } })
                                        .populate({ path : 'questions' , populate : { path : 'topic'} })
                                        .populate({ path : 'questions' , populate : { path : 'space'} });
    const questions = spaceObject.questions;
    for( let question of questions ){
        const questionObject = question.toJSON();
        questionObjects.push({ ...questionObject , user : { ...questionObject.user } , password : null })
    }
    return questionObjects;
}



const getQuestionsByTopic = async (topic) => {
    const questionObjects = [];
    const topicObject = await Topic.findById(topic)
                                        .populate({ path : 'questions' , populate : { path : 'user' } })
                                        .populate({ path : 'questions' , populate : { path : 'topic'} })
                                        .populate({ path : 'questions' , populate : { path : 'space'} });
    const questions = topicObject.questions;
    for( let question of questions ){
        questionObjects.push({ ...question.toJSON() , user : {...question.toJSON().user , password : null } })
    }
    return questionObjects;
}



const getUserSpecificQuestions = async (user) => {
    let questionObjects = [];
    for( let space of user.spaces ){
        const questions = await getQuestionsBySpace(space);
        for( question of questions ){
            questionObjects.push(question);
        }
    }
    for( let topic of user.topics ){
        const questions = await getQuestionsByTopic(topic);
        for( question of questions ){
            questionObjects.push(question);
        }
    }
    return questionObjects;
}


const getSimilarQuestions = async (filter) => {
    const questionId = filter.similar;
    const question = await Question.findById(questionId);
    const questionObjects = [];
    const spaceQuestions = await getQuestionsBySpace(question.space);
    const topicQuestions = await getQuestionsByTopic(question.topic);
    for( const question of spaceQuestions ){
        questionObjects.push(question);
    }
    for( const question of topicQuestions ){
        questionObjects.push(question);
    }
    return questionObjects;
}




module.exports.getQuestions = async (req,res) => {
    try{
        let { user } = req;
        const { filter , rangeStart } = req.body;
        let questionObjects = [];

        if( filter && filter.similar ){
            questionObjects = await getSimilarQuestions(filter);
        }
        else if( filter){
            questionObjects = await getFilteredQuestions(filter);
        }else{
            questionObjects = await getUserSpecificQuestions(user);
        }

        for( let question of questionObjects ){
            question.description = JSON.stringify(
                JSON.parse(
                    fs.readFileSync(path.join(__dirname , '..' ,'..' ,'data' , 'questions' , question.description))
            ))
        }

        const noOfResults = questionObjects.length;

        if( rangeStart >= 0 ){
            questionObjects = await spliceQuestions(questionObjects , rangeStart )  
        }

        return res.status(200).json({
            message : "Questions Loaded",
            questions : questionObjects ,
            success : true ,
            results : noOfResults
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            message : "Something went wrong"
        })
    }
}


const spliceQuestions =  async (questions , rangeStart ) => {
    const spliceLength = questions.length - rangeStart > 4 ? 5 : questions.length - rangeStart; 
    return questions.splice(rangeStart , spliceLength);
}