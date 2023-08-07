const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

router.use(express.static('public'));

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers;
	console.log(authHeader);
	next();
};

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/login', (req, res) => {
	res.render('login');
	console.log(`${req.url}`);
});

router.get('/dashboard', authMiddleware, (req, res) => {
	res.render('dashboard');
	console.log(`${req.url}`);
});

router.get('/test', (req, res) => {
	res.render('test');
	console.log(`${req.url}`);
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use("/api", require("./api/User/index"));
router.use("/api/inventory", require("./api/Inventory/index"));

module.exports = router;

