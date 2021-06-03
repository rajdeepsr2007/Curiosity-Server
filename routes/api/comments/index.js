const express = require('express');
const router = express.Router();
const commentController = require('../../../controllers/comment/index');
const passport = require('passport');

router.post('/add',passport.authenticate('jwt'),commentController.addComment);
router.post('/get-comments',passport.authenticate('jwt'),commentController.getComments);

module.exports = router ;
