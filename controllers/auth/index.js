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
            const firstLogin = user.firstLogin;
            if( firstLogin ){
                user.firstLogin = false;
                await user.save();
            } 
            const token = await jwt.sign(user.toJSON() , 'curiosity' , { expiresIn : 1000000 } )
            return res.status(200).json({
                token : token ,
                email : user.email ,
                username : user.username,
                success : true,
                firstLogin : firstLogin
            })
        }else{
            user = await User.findOne({ username : email });
            const token = await jwt.sign(user.toJSON() , 'curiosity' , { expiresIn : 1000000 } )
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
                    firstLogin : firstLogin
                })
            }
        }
    }catch(error){
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }  
}

module.exports.jwtAuth = (req,res) => {
    return res.status(200).json({
        message : req.user
    })
}

module.exports.getAllInterests = async (req , res) => {
    try{
        const topics = [
            'Economics',
            'Cars and Automobiles',
            'Medicine and Healthcare',
            'Photography',
            'Science',
            'Technology',
            'Video Games',
            'Entrepreneurship',
            'Writing',
            'Music',
            'Books',
            'Food and Beverages'
        ];
        return res.status(200).json({
            topics : topics
        })
    }catch(error){
        return res.status(500).json({
            message : 'Something went wrong'
        })
    }
}