const express = require("express");
const router = express.Router();
const inventory = require("../Inventory/inventory");

router.post('/create', inventory.create);
router.get('/get', inventory.get);
router.delete('/delete/:id', inventory.delete);
router.put('/edit/:id', inventory.edit);

module.exports = router;