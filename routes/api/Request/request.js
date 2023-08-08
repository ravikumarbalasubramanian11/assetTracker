const models = require("../../../modals");
const { hierarchy } = require("../User/user");

exports.create = async (req, res) => {
	try {
		const { requestType, assetType, presentStatus, issue, UserId } = req.body;

		if (![1, 2, 3].includes(Number(requestType))) {
			return res.status(400).json({ success: false, message: "Invalid requestType" });
		}
		if (![1, 2, 3].includes(Number(assetType))) {
			return res.status(400).json({ success: false, message: "Invalid assetType" });
		}
		if (![1, 2, 3].includes(Number(presentStatus))) {
			return res.status(400).json({ success: false, message: "Invalid presentStatus" });
		}

		if (issue && typeof issue !== "string") {
			return res.status(400).json({ success: false, message: "Invalid issue. It must be a string." });
		}

		const user = await models.User.findOne({ where: { id: UserId } });

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid UserId" });
		}

		const hierarchyId = user.hierarchyId;

		const createdRequest = await models.Request.create({
			requestType: requestType,
			assetType: assetType,
			presentStatus: presentStatus,
			issue: issue || "", // Use an empty string if issue is not provided
			stage: hierarchyId,
			status: 1,
			UserId: UserId
		});

		return res.status(201).json({ success: true, message: "Request created successfully!", data: createdRequest });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
};

exports.getRequest = async (req, res) => {
	try {
		const userId = 5; // Change this value to the desired user's ID

		const requests = await models.Request.findAll({
			where: {
				stage: userId
			}
		});

		return res.status(200).json({ success: true, data: requests });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
};

exports.approve = async (req, res) => {
	try {
		const id = req.params.id; // Change this value to the desired user's ID

		const requests = await models.Request.update({
			where: {
				id: id
			}
		});

		return res.status(200).json({ success: true, data: requests });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
};
