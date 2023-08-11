"use strict";

module.exports = (sequelize, Sequelize) => {
	const Request = sequelize.define("Request", {
		requestType: {
			type: Sequelize.INTEGER, // 1: Request for Asset, 2: Request for Service, 3: Return the asset
		},
		issue: {
			type: Sequelize.STRING,
		},
		assetType: {
			type: Sequelize.INTEGER, // 1: Laptop, 2: PC, 3: Mobile
		},
		stage:{
			type: Sequelize.INTEGER,  // person who pass (or) approve the application most recently
		},
		status: {
			type: Sequelize.INTEGER, // 1: Pending, 2: Completed, 3: Cancelled, 4: Rejected  5:Resolved
		},
	});

	Request.associate = (models) => {
		Request.belongsTo(models.User);
		Request.belongsTo(models.Inventory)
	};

	return Request;
};
