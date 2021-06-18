const express = require('express');
const router = express.Router();
const answerController = require('../../../controllers/answer');
const passport = require('passport');

router.post('/add',passport.authenticate('jwt'), answerController.addAnswer);
router.post('/get-answers',passport.authenticate('jwt'),answerController.getAnswers);
router.post('/vote',passport.authenticate('jwt'),answerController.voteAnswer);
router.delete('/delete-answer/:aid/:quid',passport.authenticate('jwt'),answerController.deleteAnswerRequest)

module.exports = router;