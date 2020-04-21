const {Router} = require('express');
const UserController = require('./users.controller');

const router = new Router();

router.get('/init_sse_connection', UserController.addUser);
router.get('/quantity', UserController.getUserQuantity);


module.exports = router;