const express = require('express');
const router = express.Router();
const questionController = require('../../../controllers/question/index');
const passport = require('passport');

router.post('/add', passport.authenticate('jwt') , questionController.addQuestion);
router.get('/get-questions' , passport.authenticate('jwt') , questionController.getQuestions );

module.exports = router ;
