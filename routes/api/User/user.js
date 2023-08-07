const models = require("../../../modals");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.user = async (req, res) => {
	try {
		return res.json({ success: true, message: "Received" });
	} catch (err) {
		return res.send("Err " + err);
	}
};

exports.create = async (req, res) => {
	try {
		const {
			firstName,
			lastname,
			email,
			username,
			password,
			phoneNumber,
			permantAddress,
			presentAddress,
			accountNumber,
			ifscCode,
			panNumber,
			address,
			DOB,
			bloodGroup,
			emergencyContact,
			gender,
			DOJ,
			employeeStatus,
			comments,
			hierarchyId
		} = req.body;

		if (!email) {
			return res.send({ success: false, message: "Missing email Id" });
		}

		if (!username) {
			return res.send({ success: false, message: "Missing username" });
		}

		if (!password) {
			return res.send({ success: false, message: "Enter a valid Password" });
		}

		const hashPassword = await bcrypt.hash(password, 11);

		const newUser = await models.User.create({
			firstName: firstName,
			lastname: lastname,
			email: email,
			username: username,
			password: hashPassword
		})

		return res.send({ success: true, message: "User Created Successfully" })
	}
	catch (err) {
		console.log({ success: false, message: err });
		return res.status(500).json({ "error": `Internal Server Error ${err}` });
	}
}

exports.login = async (req, res) => {
	try {
		const { username, password } = req.body;

		console.log(req.body);
		if (!username || !password) {
			return res.send({ success: false, message: 'Username and password missing' });
		}

		let login = await models.User.findOne({
			where: {
				username: username
			},
			attributes: ['username', 'password']
		});

		if (!login) {
			return res.send({ success: false, message: "Invalid username and password" });
		}

		const isPasswordValid = await bcrypt.compare(password, login.password);

		console.log(isPasswordValid);
		if (!isPasswordValid) {
			return res.send({ success: false, message: "Invalid username and password" });
		}
		const secretKey = '987654321';
		const payload = {
			username: username,
			id: login.id
		};
		const token = jwt.sign(payload, secretKey);

		if (isPasswordValid) {
			return res.status(200).send({ success: true, message: "Successfully login ", token });
		}
	} catch (err) {
		console.log({ success: false, message: err });
		return res.status(500).json({ "error": `Internal Server Error ${err}` });
	}
}