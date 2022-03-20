const express = require('express');
const router = express.Router();

const LoginController = require('../app/controllers/LoginController');

router.post('/loginStore', LoginController.loginStore);
router.get('/', LoginController.showPage);

module.exports = router;