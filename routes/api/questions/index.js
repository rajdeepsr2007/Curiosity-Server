const express = require('express');
const router = express.Router();
const questionController = require('../../../controllers/question/index');
const passport = require('passport');

router.post('/add', passport.authenticate('jwt') , questionController.addQuestion);
router.post('/get-questions' , passport.authenticate('jwt') , questionController.getQuestions );
router.delete('/delete-question/:id' , passport.authenticate('jwt') , questionController.deleteQuestion);

module.exports = router ;
