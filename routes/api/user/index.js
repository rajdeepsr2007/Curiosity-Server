const express = require('express');
const passport = require('../../../config/passport-jwt');
const router = express.Router();

const userController = require('../../../controllers/user/userController');

router.get('/topics' , passport.authenticate('jwt') , userController.getAllTopics );
router.post('/edit-topics' , passport.authenticate('jwt') , userController.editTopics);
router.get('/picture', passport.authenticate('jwt') , userController.getUserPicture );
router.post('/edit-picture' , passport.authenticate('jwt') , userController.editPicture  );

module.exports = router;