const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../libs/logger');
const utilsDB = require('../db');

const db = utilsDB.getDBConexion()
const weatherCollection = db.collection('weather');
logger.info('Collection weather');

// Create indexes
weatherCollection.createIndex("date");


exports.saveWeather = async (weatherInfo) => {
    let result = await weatherCollection.insertOne(weatherInfo, {w:1})
    return result.ops[0];
};
