const User = require('../../models/user/');
const jwt = require('jsonwebtoken');

module.exports.signupUser = async ( req , res ) => {
    try{
        const { email , username , password } = req.body;
        let user = await User.findOne( { email : email } );
        //console.log(user);
        if( user ){
            return res.status(200).json({
                message : `Email ${email} already exists`,
                success : false
            })
        }else{
            user = await User.findOneAndRemove( { username : username } );
            if( user ){
                return res.status(200).json({
                    message : `Username ${username} already exists`,
                    success : false
                })
            }else{
                user = await User.create({
                    email ,
                    username ,
                    password ,
                    firstLogin : true
                });
                return res.status(200).json({
                    message : 'Account was created',
                    user : { email : email , username : username },
                    success : true
                })
            }
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }
}

module.exports.login = async (req , res) => {

    try{
        const { email } = req.body;
        let user = await User.findOne({ email : email });
        if( user ){
            const token = await jwt.sign(user.toJSON() , 'curiosity' , { expiresIn : 1000000 } )
            return res.status(200).json({
                token : token ,
                email : user.email ,
                username : user.username,
                success : true,
                firstLogin : user.firstLogin
            })
        }else{
            user = await User.findOne({ username : email });
            const token = await jwt.sign(user.toJSON() , 'curiosity' , { expiresIn : 1000000 } )
            if( user ){
                return res.status(200).json({
                    token : token ,
                    email : user.email ,
                    username : user.username,
                    success : true,
                    firstLogin : user.firstLogin
                })
            }
        }
    }catch(error){
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }  
}