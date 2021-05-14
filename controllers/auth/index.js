const User = require('../../models/user/');

module.exports.signupUser = async ( req , res ) => {
    try{
        const { email , username , password } = req.body;
        let user = await User.findOne( { email : email } );
        //console.log(user);
        if( user ){
            return res.status(400).json({
                message : `Email <strong>${email}</strong> already exists`
            })
        }else{
            user = await User.findOneAndRemove( { username : username } );
            if( user ){
                return res.status(400).json({
                    message : `Username <strong>${username}</strong> already exists`
                })
            }else{
                user = await User.create({
                    email , username , password
                });
                return res.status(200).json({
                    message : 'Account was created',
                    user : { email : email , username : username }
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