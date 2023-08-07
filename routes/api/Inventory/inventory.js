const models = require("../../../modals");

exports.create = async (req, res) => {
	try {
		const { assetName, assetId, manufacturer, vendorDetails, purchaseDate, spec } = req.body;

		if (!assetName) {
			return res.send({ success: false, message: "Invalid asset name" })
		}
		if (!assetId) {
			return res.send({ success: false, message: "Invalid asset id" });
		}
		if (!manufacturer) {
			return res.send({ success: false, message: 'Manufacturer is required' });
		}
		if (!vendorDetails) {
			return res.send({ success: false, message: 'Vendor is required' })
		}
		if (!purchaseDate) {
			return res.send({ success: false, message: 'PurchaseDate is required' })
		}
		if (!spec) {
			return res.send({ success: false, message: 'Spec is required' })
		}

		const create = await models.Inventory.create({
			assetName: assetName,
			assetId: assetId.toUpperCase(),
			manufacturer: manufacturer,
			purchaseDate: purchaseDate,
			vendorDetails: vendorDetails,
			spec: spec,
			status: "Active"
		})

		if (!create) {
			return res.send({ success: false, message: 'Error while creating device' });
		}
		return res.send({ success: true, message: 'Device successfully added in inventory' });
	}

	catch (err) {
		console.log({ success: false, message: err });
		return res.status(500).json({ "error": `Internal Server Error ${err}` });
	}
}

exports.get = async (req, res) => {
	try{
		const getDetails = await models.Inventory.findAll();
		return res.json({success: true, message: getDetails });
	}
	catch(err){
		console.log({ success: false, message: err });
		return res.status(500).json({ "error": `Internal Server Error ${err}` });
	}
}