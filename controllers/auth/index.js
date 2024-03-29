const User = require('../../models/user/');
const jwt = require('jsonwebtoken');
const env = require('../../config/environment');

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
            user = await User.findOne( { username : username } );
            const image = '/images/avatars/'+ Math.floor((Math.random()*9 + 1 ))  +'.jpg'
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
                    firstLogin : true,
                    picture : image
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
        let user = await User.findOne({ email : email }).populate('topics').populate('spaces');
        if( user ){
            const firstLogin = user.firstLogin;
            if( firstLogin ){
                user.firstLogin = false;
                await user.save();
            } 
            const token = await jwt.sign(user.toJSON() , env.jwt_secret , { expiresIn : 100000000 } )
            return res.status(200).json({
                token : token ,
                email : user.email ,
                username : user.username,
                success : true,
                firstLogin : firstLogin,
                user : {...user.toJSON() , password : null}
            })
        }else{
            user = await User.findOne({ username : email });
            const token = await jwt.sign(user.toJSON() , env.jwt_secret , { expiresIn : 100000000 } )
            if( user ){
                const firstLogin = user.firstLogin;
                if( firstLogin ){
                    user.firstLogin = false;
                    await user.save();
                } 
                return res.status(200).json({
                    token : token ,
                    email : user.email ,
                    username : user.username,
                    success : true,
                    firstLogin : firstLogin,
                    user : {...user.toJSON() , password : null}
                })
            }
        }
    }catch(error){
        return  res.status(500).json({
            message : 'Something went wrong'
        })
    }  
}

module.exports.autoLogin = async (req,res) => {
    try{
        const user = await User.findById(req.user._id).populate('topics').populate('spaces');
        if( user ){
            const token = await jwt.sign(user.toJSON() , env.jwt_secret , {expiresIn : 100000000})
            return res.status(200).json({
                email : user.email ,
                username : user.username ,
                token : token,
                success : true,
                user : {...user.toJSON() , password : null}
            })
        }
    }catch(error){
        console.log(error);
        return  res.status(500).json({
            message : 'Something went wrong'
        })
    }
}

// module.exports.jwtAuth = (req,res) => {
//     return res.status(200).json({
//         message : req.user
//     })
// }

