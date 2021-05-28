const express = require('express');
const router = express.Router();
const answerController = require('../../../controllers/answer');
const passport = require('passport');

router.post('/add',passport.authenticate('jwt'), answerController.addAnswer);
router.post('/get-answers',answerController.getAnswers);

module.exports = router;