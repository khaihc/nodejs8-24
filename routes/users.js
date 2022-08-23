var express = require('express');
var router = express.Router();
const controller = require('../controlllers/users');
const auth = require('../middleware/auth')

router.get('/', controller.getUsers);
router.get('/:userIdemail', auth.authentication, controller.getUserById);
router.post('/save', controller.createUser);
router.post('/update', controller.updateUser);
router.get('/delete/:userIdemail', controller.delUserByID);
router.post('/checklogin', controller.checklogin);


module.exports = router;
