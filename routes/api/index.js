const express = require('express');
const router = express.Router();

router.use('/auth' , require('./auth/'));
router.use('/user', require('./user/'))
router.use('/spaces',require('./spaces'));
router.use('/questions',require('./questions'));
router.use('/answers',require('./answers'));
router.use('/comments',require('./comments'));
router.use('/polls',require('./polls'));

module.exports = router;