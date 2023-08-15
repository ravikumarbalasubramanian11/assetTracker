const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
	const secretKey = "987654321";
	try {
		const token = req.headers['x-at-sessiontoken'];

		if (!token) {
			return res.status(401).json({ success: false, message: 'Token not provided' });
		}
		const decoded = jwt.verify(token, secretKey);
		if (!decoded.username || !decoded.id) {
			return res.status(401).json({ success: false, message: 'Invalid token data' });
		}
		res.locals.id = decoded.id;
		console.log("Id of the user login = ", decoded.id)
		next();
	} catch (err) {
		return res.status(401).json({ success: false, message: 'Invalid token', error: err.message });
	}
}

module.exports = requireAuth;