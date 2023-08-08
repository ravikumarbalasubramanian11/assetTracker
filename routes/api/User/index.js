const express = require("express");
const router = express.Router();
const user = require("../User/user");
const helper = require("../../helper");

router.post('/create', user.create);
router.get('/', user.user);
router.post('/login', user.login);
router.get('/hierarchy',helper, user.hierarchy);

module.exports = router;