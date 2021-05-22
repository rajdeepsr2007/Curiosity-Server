const multer = require('multer');
const path = require('path');
const backgroundPath = path.join('uploads' , 'backgrounds/')

let storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb( null , path.join(__dirname , '..' ,'..' , backgroundPath ) )
    },
    filename : function(req,file,cb){
        cb( null , file.fieldname + Date.now() + file.originalname )
    }
})

const uploadBackground = multer({ storage : storage }).single('background');

module.exports = uploadBackground;