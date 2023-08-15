const express = require("express");
const router = express.Router();
const user = require("../User/user");
const helper = require("../../helper");

router.post('/create', user.create);
router.post('/login', user.login);
router.get('/hierarchy', helper, user.hierarchy);
router.get('/list', user.userList);

module.exports = router;