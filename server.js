const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const winston = require('winston');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const config = require('./config.json');
const logger = require('./libs/logger');
const utils = require('./libs/utils');
const db = require('./db/db');


const configExpress = () => {
    app.server = http.createServer(app);

    // 3rd party middleware
    app.use(cors({
        exposedHeaders: config.corsHeaders
    }));

    // prepare logger to print unique uuid for each request
    const uuidv1 = require('uuid/v1');
    const createNamespace = require('continuation-local-storage').createNamespace;
    const myRequest = createNamespace('my request');
    // Run the context for each request. Assign a unique identifier to each request
    app.use(function(req, res, next) {
        myRequest.run(function() {
            myRequest.set('reqId', uuidv1());
            next();
        });
    });

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({
        limit : config.bodyLimit
    }));
};


const scheduleLoadingData = () => {
    const indegoConnector = require('./connectors/indego');
    const OWMConnector = require('./connectors/OWM');
    // schedule loading info every hour (minute 1);
    var j = schedule.scheduleJob('1 * * * *', () => {
        indegoConnector.loadAndSaveData();
        OWMConnector.loadAndSaveData();
    });
};


const runServer = async () => {
    try {
        await db.initializeDB();
        logger.log("Server connected to DB");

        // schedule loading data from connectors every hour
        scheduleLoadingData();

        // api router
        const api = require('./api/api');
        app.use(config.API_PATH, api.initializeAPI(app));
        
        // start listening for requests
        app.server.listen(process.env.PORT || config.SERVER_PORT, () => {
            logger.info(`Started on port ${app.server.address().port}`);
        });
    } catch (error) {
        logger.error("Error running Server");
        logger.error(error);
    }
};


// initialize logs folder
utils.createFolder(config.LOGS_DIR_NAME);

configExpress();
runServer();
