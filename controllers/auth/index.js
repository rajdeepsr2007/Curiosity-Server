const User = require('../../models/user/');

module.exports.signupUser = async ( req , res ) => {
    return res.status(200).json({
        message : req.body
    })
}