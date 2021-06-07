const express = require('express');
const router = express.Router();
const spaceController = require('../../../controllers/space/index');
const passport = require('passport');

router.post('/add', passport.authenticate('jwt') , spaceController.addSpace);
router.post('/get-spaces', passport.authenticate('jwt') , spaceController.getSpaces);
router.post('/follow',passport.authenticate('jwt'),spaceController.followSpace)
router.post('/by-topic',spaceController.getSpacesByTopic)

module.exports = router ;
