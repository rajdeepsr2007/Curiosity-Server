const express = require('express');
const router = express.Router();

const authController = require('../../../controllers/auth/');
const localAuth = require('../../../config/local-auth');

const passport = require('../../../config/passport-jwt');

router.post( '/signup' , authController.signupUser );
router.post( '/login' , localAuth.localAuth , authController.login )
router.post( '/jwt' , passport.authenticate('jwt') , authController.jwtAuth );
router.get( '/interests' , passport.authenticate('jwt') , authController.getAllInterests);

module.exports = router;