const Space = require('../../models/space/index');
const backgroundUpload = require('../../models/space/background-upload');
const path = require('path');

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
                        background : path.join('/uploads','backgrounds/') + req.file.filename
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