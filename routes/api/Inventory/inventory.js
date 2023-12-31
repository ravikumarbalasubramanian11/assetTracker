const models = require("../../../modals");
const {
	Op
} = require('sequelize');

exports.create = async (req, res) => {
	try {
		const {
			assetName,
			assetId,
			manufacturer,
			vendorDetails,
			purchaseDate,
			spec,
			assetType
		} = req.body;

		if (!assetName) {
			return res.send({
				success: false,
				message: "Invalid asset name"
			})
		}
		if (!assetId) {
			return res.send({
				success: false,
				message: "Invalid asset id"
			});
		}
		if (!manufacturer) {
			return res.send({
				success: false,
				message: 'Manufacturer is required'
			});
		}
		if (!vendorDetails) {
			return res.send({
				success: false,
				message: 'Vendor is required'
			})
		}
		if (!purchaseDate) {
			return res.send({
				success: false,
				message: 'PurchaseDate is required'
			})
		}
		if (!spec) {
			return res.send({
				success: false,
				message: 'Spec is required'
			})
		}
		if (!assetType || assetType <= 0) {
			return res.send({
				success: false,
				message: 'Asset Type is required'
			})
		}

		const create = await models.Inventory.create({
			assetName: assetName,
			assetId: assetId.toUpperCase(),
			manufacturer: manufacturer,
			purchaseDate: purchaseDate,
			vendorDetails: vendorDetails,
			assetType: assetType,
			spec: spec,
			status: "Available"
		})

		if (!create) {
			return res.send({
				success: false,
				message: 'Error while creating device'
			});
		}
		return res.send({
			success: true,
			message: 'Device successfully added in inventory'
		});
	} catch (err) {
		console.log({
			success: false,
			message: err
		});
		return res.status(500).json({
			"error": `Internal Server Error ${err}`
		});
	}
}

exports.get = async (req, res) => {
	try {
		const getDetails = await models.Inventory.findAll({
			include: [{
				model: models.User,
				attributes: ['username']
			}]
		});
		return res.json({
			success: true,
			message: getDetails
		});
	} catch (err) {
		console.log({
			success: false,
			message: err
		});
		return res.status(500).json({
			"error": `Internal Server Error ${err}`
		});
	}
}

exports.inventorySearchId = async (req, res) => {
	try {
		const getDetails = await models.Inventory.findAll({
			attributes: ["id", "assetName", "assetId", "manufacturer", "spec", "purchaseDate"],
			where: {
				UserId: res.locals.id
			}
		});

		return res.json({
			success: true,
			message: getDetails
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: `Internal Server Error: ${err}`
		});
	}
};

exports.delete = async (req, res) => {
	try {
		const deleteRecord = await models.Inventory.destroy({
			where: {
				id: req.params.id
			}
		});
		if (!deleteRecord) {
			return res.json({
				success: false,
				message: "No record found"
			});
		}
		return res.json({
			success: true,
			message: "Successfully delete the asset"
		});
	} catch (err) {
		console.log({
			success: false,
			message: err
		});
		return res.status(500).json({
			"error": `Internal Server Error ${err}`
		});
	}
}

exports.edit = async (req, res) => {
	try {
		const id = parseInt(req.params.id);
		if (isNaN(id) || id <= 0) {
			return res.status(400).json({
				success: false,
				message: 'Invalid ID. ID must be a positive non-zero integer.'
			});
		}

		const {
			assetName,
			assetId,
			manufacturer,
			vendorDetails,
			purchaseDate,
			spec,
			status,
			UserId
		} = req.body;

		console.log(req.body)

		const assetEdit = await models.Inventory.update({
			assetName: assetName,
			assetId: assetId,
			manufacturer: manufacturer,
			purchaseDate: purchaseDate,
			vendorDetails: vendorDetails,
			spec: spec,
			status: status,
			UserId: UserId == 0 ? null : UserId
		}, {
			where: {
				id: id
			}
		});

		if (assetEdit[0] === 0) {
			return res.status(404).json({
				success: false,
				message: 'Device not found for the given ID.'
			});
		}

		return res.json({
			success: true,
			message: 'Edit successfully'
		});
	} catch (err) {
		console.log({
			success: false,
			message: err
		});
		return res.status(500).json({
			error: `Internal Server Error ${err}`
		});
	}
};

exports.unassigned = async (req, res) => {
	try {
		let unassignedList = await models.Inventory.findAll({
			where: {
				UserId: null,
				status: 'Active',
				assetType: req.params.assetType
			},
			attributes: ["id", "assetName"]
		})

		return res.status(200).json({
			success: true,
			message: unassignedList
		})

	} catch (err) {
		console.log({
			success: false,
			message: err
		});
		return res.status(500).json({
			"error": `Internal Server Error ${err}`
		});
	}
}

exports.itemsList = async (req, res) => {
	try {
		let counts = await models.Inventory.findAll({
			attributes: ['status', [models.sequelize.fn('COUNT', 'status'), 'count']],
			where: {
				status: {
					[Op.or]: ['Available', 'UnderService', 'Scrap', 'Lost']
				}
			},
			group: 'status'
		});

		console.log(counts);

		const statusCounts = {};
		counts.forEach(item => {
			statusCounts[item.status] = item.dataValues.count;
		});

		return res.status(200).json({
			success: true,
			data: statusCounts
		});

	} catch (error) {
		console.log({
			success: false,
			message: error
		});
		return res.status(500).json({
			error: `Internal Server Error ${error}`
		});
	}
};