const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

router.use(express.static('public'));

// const authMiddleware = (req, res, next) => {
// 	const authHeader = req.headers.authorization;
// 	console.log(req.cookies);

// 	if (!authHeader || !authHeader.startsWith('Bearer ')) {
// 		return res.status(401).json({ message: 'Unauthorized' });
// 	}

// 	const token = authHeader.split(' ')[1];

// 	try {
// 		const decoded = jwt.verify(token, 'your_secret_key');
// 		// Attach the decoded token payload (user information) to the request object for further use
// 		req.user = decoded;
// 		next();
// 	} catch (err) {
// 		return res.status(403).json({ message: 'Invalid or expired token' });
// 	}
// };


router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.get('/login', (req, res) => {
	res.render('login');
	console.log(`${req.url}`);
});

router.get('/dashboard', (req, res) => {
	// Only render the dashboard if the user is authenticated
	res.render('dashboard');
	console.log(`${req.url}`);
});

router.get('/test', (req, res) => {
	res.render('test');
	console.log(`${req.url}`);
});

router.get('/asset', (req, res) => {
	res.render('asset');
	console.log(`${req.url}`);
});

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use("/api", require("./api/User/index"));
router.use("/api/inventory", require("./api/Inventory/index"));
router.use("/api/request", require("./api/Request/index"));

module.exports = router;
