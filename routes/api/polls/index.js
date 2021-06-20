const express = require('express');
const router = express.Router();
const pollController = require('../../../controllers/poll/index');
const passport = require('passport');

router.post('/add', passport.authenticate('jwt') , pollController.addPoll);
router.get('/get-poll/:id',pollController.getPoll)

module.exports = router ;
