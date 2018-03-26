const Router = require('express').Router;
const config = require('../config.json');
const stationsApi = require('./stations/stations');


exports.initializeAPI = app => {
	let api = Router();
	api.use(config.API_VERSION + '/stations', stationsApi.loadRoutes());
	return api;
};
