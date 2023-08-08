"use strict";

module.exports = (sequelize, Sequelize) => {
	const Request = sequelize.define("Request", {
		requestType: {
			type: Sequelize.INTEGER, // 1: Request for Asset, 2: Request for Service, 3: Return the asset
		},
		assetType: {
			type: Sequelize.INTEGER, // 1: Laptop, 2: PC, 3: Mobile
		},
		presentStatus: {
			type: Sequelize.INTEGER, // 1: Working, 2: Not Working, 3: Partially Working
		},
		issue: {
			type: Sequelize.STRING,
		},
		stage:{
			type: Sequelize.INTEGER,  // person who pass (or) approve the application most recently
		},
		status: {
			type: Sequelize.INTEGER, // 1: Pending, 2: Resolved, 3: Cancelled, 4: Rejected
		},
	});

	Request.associate = (models) => {
		Request.belongsTo(models.User);
	};

	return Request;
};
