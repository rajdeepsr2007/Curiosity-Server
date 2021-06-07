const express = require('express');
const passport = require('../../../config/passport-jwt');
const router = express.Router();

const userController = require('../../../controllers/user/userController');

router.get('/topics' , passport.authenticate('jwt') , userController.getAllTopics );
router.post('/edit-topics' , passport.authenticate('jwt') , userController.editTopics);
router.get('/picture', passport.authenticate('jwt') , userController.getUserPicture );
router.post('/edit-picture' , passport.authenticate('jwt') , userController.editPicture  );
router.get('/get-user-topics-spaces' , passport.authenticate('jwt') , userController.getTopicsSpaces);
router.post('/get-users',passport.authenticate('jwt'),userController.getUsers);
router.post('/follow',passport.authenticate('jwt'),userController.followUser);

module.exports = router;