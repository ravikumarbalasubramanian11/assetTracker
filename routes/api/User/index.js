const express = require("express");
const router = express.Router();
const user = require("../User/user");

router.post('/create', user.create);
router.get('/', user.user);
router.post('/login', user.login);

module.exports = router;