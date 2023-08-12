const express = require("express");
const router = express.Router();
const request = require("../Request/request");
const helper = require("../../helper");

router.post('/create', helper, request.create);
router.get('/getRequest', helper, request.getRequest);
router.put('/approve/:id', helper, request.approve);
router.get('/transaction', helper, request.transaction);

module.exports = router;