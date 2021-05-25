const express = require('express');
const router = express.Router();

router.use('/auth' , require('./auth/'));
router.use('/user', require('./user/'))
router.use('/spaces',require('./spaces'));
router.use('/questions',require('./questions'));

module.exports = router;