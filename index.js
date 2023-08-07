const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes/index');
const path = require('path');

const db = require("./modals");

db.sequelize.sync({ alter: true, logging: false })
	.then(() => {
		console.log("Synced db.");
	})
	.catch((err) => {
		console.error("Failed to sync db: ", err);
	});

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});