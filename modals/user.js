"use strict";

module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define("User", {
		firstName: {
			type: Sequelize.STRING
		},
		lastname: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
		},
		username: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		phoneNumber: {
			type: Sequelize.JSONB
		},
		address: {
			type: Sequelize.JSONB
			/*
			permantAddress:3/3 Chennai,
			presentAddress: Coimbatore, 641-909
			*/
		},
		bankDetails: {
			type: Sequelize.JSONB
			/*
			accountNumber:9652234567245,
			ifscCode:UJXD932930SN,
			panNumber:HBBI8989HH,
			address:"67/8 New Delhi, India"
			*/
		},
		personalDetails: {
			type: Sequelize.JSONB,
			/*
			DOB:2023/07/25,
			bloodGroup: 1:A+, 2:A-, 3:B+, 4:B-, 5:AB+, 6:AB-, 7:O+, 8: O-,
			emergencyContact: 9876543210,
			gender: 1: Male 2: Female 3: TransGender
			*/
		},
		DOJ: {
			type: Sequelize.DATEONLY,
		},
		employeeStatus: {
			type: Sequelize.INTEGER,
			/*
			1 - Active,
			2 - InActive,
			3 - Intern
			*/
		},
		comments: {
			type: Sequelize.STRING
		},
		hierarchyId: {
			type: Sequelize.INTEGER // Hierarchy Id
		}
	});

	// User.associate = (models) => {
	// 	User.belongsTo(models.Client);
	// };

	return User;
};