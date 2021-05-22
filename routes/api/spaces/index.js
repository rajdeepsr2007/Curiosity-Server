const express = require('express');
const router = express.Router();
const spaceController = require('../../../controllers/space/index');
const passport = require('passport');

router.post('/add', passport.authenticate('jwt') , spaceController.addSpace);

module.exports = router ;
