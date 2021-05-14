const User = require('../models/user/index');

module.exports.localAuth = async (req , res , next) => {
    try{
        const { email , password } = req.body;
        let user = await User.findOne({ email : email });
        if( !user ){
            user = await User.findOne({ username : email });
        }
        if( user ){
            if( user.password === password ){
                next();
            }else{
                return res.status(200).json({
                    message : 'Invalid username or password',
                    success : false
                }) 
            }
        }else{
            return res.status(200).json({
                message : 'Invalid username or password',
                success : false
            })
        }
    }catch(error){
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }
}