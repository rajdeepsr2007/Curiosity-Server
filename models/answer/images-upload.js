const multer = require('multer');
const path = require('path');
const imagePath = path.join('uploads' , 'answers/')

let storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb( null , path.join(__dirname , '..' ,'..' , imagePath ) )
    },
    filename : function(req,file,cb){
        cb( null , file.fieldname + Date.now() + file.originalname )
    }
})

const uploadImages = multer({ storage : storage }).array('images',5);

module.exports = uploadImages;