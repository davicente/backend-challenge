const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../libs/logger');
const utilsDB = require('../db');

const db = utilsDB.getDBConexion()
const stationsCollection = db.collection('stations');
logger.info('Collection stations');

// Create indexes
stationsCollection.createIndex("properties.kioskId");
stationsCollection.createIndex("date");


exports.saveStationSnapshot = async (stationData) => {
    let result = await stationsCollection.insertOne(stationData, {w:1})
    return result.ops[0];
};
