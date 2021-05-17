const express = require('express');
const passport = require('../../../config/passport-jwt');
const router = express.Router();

const userController = require('../../../controllers/user/userController');

router.get('/topics', passport.authenticate('jwt') ,userController.getAllTopics );

module.exports = router;