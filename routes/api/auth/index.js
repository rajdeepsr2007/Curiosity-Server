const express = require('express');
const router = express.Router();

const authController = require('../../../controllers/auth/');
const localAuth = require('../../../config/local-auth');

router.post( '/signup' , authController.signupUser );
router.post( '/login' , localAuth.localAuth , authController.login )

module.exports = router;