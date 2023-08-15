const models = require("../../../modals");

exports.create = async (req, res) => {
	try {
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

		if (InventoryId) {
			const existingPendingRequest = await models.Request.findOne({
				where: {
					InventoryId: InventoryId,
					status: 1,
					requestType: 2
				}
			});

			if (existingPendingRequest) {
				return res.status(400).json({ success: false, message: "Another pending request already exists for this InventoryId." });
			}
		}

		const createdRequest = await models.Request.create({
			requestType: requestType,
			issue: issue || "", // Use an empty string if issue is not provided
			stage: hierarchyId,
			assetType: assetType,
			status: 1,
			UserId: res.locals.id,
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

		if (!Number.isInteger(Number(status)) || Number(status) <= 0) {
			return res.status(400).json({ error: "Status must be a positive integer." });
		}

		const request = await models.Request.findOne({ where: { id } });

		if (!request) {
			return res.status(404).json({ success: false, message: "Request not found" });
		}

		if (request.UserId === res.locals.id) {
			await models.Request.update(
				{
					status: 3
				},
				{
					where: {
						id: id,
						status: 1
					}
				}
			);

			return res.status(200).json({ success: true, message: "Successfully cancelled the request" })
		}

		const user = await models.User.findOne({ where: { id: res.locals.id } });
		const hierarchyId = user.hierarchyId;

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid UserId" });
		}

		if (!hierarchyId) {
			return res.status(400).json({ success: false, message: "HierarchyId is empty" });
		}

		if (!(user.id === request.stage)) {
			return res.status(400).json({ success: false, message: "Invaild to make changes" });
		}

		if (user.username === 'hr') {
			// HR users can change status to 2 and update the stage
			if (request.status !== 1) {
				return res.status(400).json({ success: false, message: "Invalid status change for HR user" });
			}
			const updatedRequest = await models.Request.update(
				{
					status: status,
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

exports.transaction = async (req, res) => {
	try {
		const userId = res.locals.id;
		const statusValues = [1, 2, 3, 4, 5];

		const statusData = {};

		for (const status of statusValues) {
			const response = await models.Request.findAll({
				where: {
					UserId: userId,
					status: status
				}
			});
			statusData[`status${status}`] = response;
		}

		return res.send({ success: true, statusData: statusData });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
}

exports.requestByStatus = async (req, res) => {
	try {
		const status = parseInt(req.params.status);

		if (status < 0 || status > 5) {
			return res.status(400).json({ success: false, error: "Invalid status value. Status must be between 0 and 5." });
		}

		let whereClause = {
			UserId: res.locals.id
		};

		if (status === 0) {
			whereClause.status = { [models.Sequelize.Op.between]: [1, 5] };
		} else {
			whereClause.status = status;
		}

		const response = await models.Request.findAll({
			where: whereClause
		});

		return res.status(200).json({ success: true, message: response });
	} catch (err) {
		console.error("Error:", err);
		return res.status(500).json({ success: false, error: `Internal Server Error: ${err}` });
	}
};
