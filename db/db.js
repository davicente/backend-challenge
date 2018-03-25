'use strict'

const MongoClient = require('mongodb').MongoClient;
let logger = require('../libs/logger');
let config = require('../config.json');

let db;

exports.getDBConexion = () => {
    if (!db) {
        logger.info('Error connecting DB');
        throw Error('Error connecting DB');
    }

    return db;
}


let initializeDB = exports.initializeDB = async () => {
    // generate database url
    let dbURL = 'mongodb://';
    if (config.DB_USERNAME !== '' && config.DB_PASSWORD !== ''){
        dbURL += config.DB_USERNAME + ':' + config.DB_PASSWORD + '@';
    } 
    dbURL += config.DB_HOST + ":" + config.DB_PORT;

    // Connect to the db
    let dbConnection = await MongoClient.connect(dbURL);
    if(!dbConnection){
        logger.info('Error connecting DB');
        throw Error('Error connecting DB');
    }

    logger.info("DB connected successfully");
    db = dbConnection.db(config.DB_NAME);
    return db;
};