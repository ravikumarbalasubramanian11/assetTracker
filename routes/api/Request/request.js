const models = require("../../../modals");

exports.create = async (req, res) => {
	try {
		console.log("11");
		const { requestType, issue, UserId, InventoryId, assetType } = req.body;

		if (![1, 2, 3].includes(Number(requestType))) {
			return res.status(400).json({ success: false, message: "Invalid requestType" });
		}

		if (issue && typeof issue !== "string") {
			return res.status(400).json({ success: false, message: "Invalid issue. It must be a string." });
		}

		if (UserId < 0) {
			return res.status(400).json({ success: false, message: "Invalid UserId" });
		}

		const user = await models.User.findOne({ where: { id: res.locals.id } });

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid UserId" });
		}

		const hierarchyId = user.hierarchyId;

		const createdRequest = await models.Request.create({
			requestType: requestType,
			issue: issue || "", // Use an empty string if issue is not provided
			stage: hierarchyId,
			assetType: assetType,
			status: 1,
			UserId: UserId,
			InventoryId: InventoryId
		});

		return res.status(201).json({ success: true, message: "Request created successfully!", data: createdRequest });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
};

exports.getRequest = async (req, res) => {
	try {
		const requests = await models.Request.findAll({
			where: {
				stage: res.locals.id
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
		const { status } = req.body;

		const id = req.params.id;

		const user = await models.User.findOne({ where: { id: res.locals.id } });

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid UserId" });
		}

		const hierarchyId = user.hierarchyId;

		const request = await models.Request.findOne({ where: { id } });

		if (!(user.id === request.stage)) {
			return res.status(400).json({ success: false, message: "Invaild to make changes" });
		}

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		if (user.username === 'hr') {
			// HR users can change status to 2 and update the stage
			if (request.status !== 1) {
				return res.status(400).json({ success: false, message: "Invalid status change for HR user" });
			}
			const updatedRequest = await models.Request.update(
				{
					status: 2,
					stage: hierarchyId
				},
				{
					where: {
						id: id,
						status: 1
					}
				}
			);

			return res.status(200).json({ success: true, message: "Request approved by HR", data: updatedRequest });
		} else {
			// Non-HR users can change status to 3 or 4, but only if the status is 1
			if (![3, 4].includes(Number(status))) {
				return res.status(400).json({ success: false, message: "Invalid status change" });
			}

			const updatedRequest = await models.Request.update(
				{
					status: status == null ? request.status : status,
					stage: hierarchyId
				},
				{
					where: {
						id: id,
						status: 1
					}
				}
			);

			return res.status(200).json({ success: true, message: "Request approved", data: updatedRequest });
		}
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
};
