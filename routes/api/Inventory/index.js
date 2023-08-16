const express = require("express");
const router = express.Router();
const inventory = require("../Inventory/inventory");
const helper = require("../../helper");

router.post('/create', inventory.create);
router.get('/get', inventory.get);
router.get('/inventorySearchId', helper, inventory.inventorySearchId);
router.delete('/delete/:id', inventory.delete);
router.put('/edit/:id', inventory.edit);

module.exports = router;