const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../libs/logger');
const utilsDB = require('../db');

const db = utilsDB.getDBConexion()
const docksCollection = db.collection('docks');
logger.info('Collection docks');

// Create indexes
docksCollection.createIndex("properties.kioskId");
docksCollection.createIndex("date");


exports.saveDockSnapshot = async (dockData) => {
    let result = await docksCollection.insertOne(dockData, {w:1})
    return result.ops[0];
};
