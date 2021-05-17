const multer = require('multer');
const path = require('path');
const picturePath = path.join('uploads' , 'avatars/')

let storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb( null , path.join(__dirname , '..' ,'..' , picturePath ) )
    },
    filename : function(req,file,cb){
        cb( null , file.fieldname + Date.now() + file.originalname )
    }
})

const uploadPicture = multer({ storage : storage }).single('picture');

module.exports = uploadPicture;