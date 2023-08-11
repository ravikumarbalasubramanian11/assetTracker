"use strict";

module.exports = (sequelize, Sequelize) => {
	const Inventory = sequelize.define("Inventory", {
		assetName: {
			type: Sequelize.STRING
		},
		assetId: {
			type: Sequelize.STRING
		},
		assetType: {
			type: Sequelize.INTEGER, // 1: Laptop, 2: PC, 3: Mobile
		},
		manufacturer: {
			type: Sequelize.STRING
		},
		vendorDetails: {
			type: Sequelize.STRING
		},
		purchaseDate: {
			type: Sequelize.DATEONLY
		},
		spec: {
			type: Sequelize.STRING
		},
		status: {
			type: Sequelize.ENUM('Active', 'Inactive', 'UnderService'),
		}
	});

	Inventory.associate = (models) => {
		Inventory.belongsTo(models.User);
	};
	return Inventory;
};