const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const ISODate = require('mongodb').ISODate;
const logger = require('../../libs/logger');
const utilsDB = require('../db');

const db = utilsDB.getDBConexion();
const stationsCollection = db.collection('stations');
logger.info('Collection stations');

// Create indexes
stationsCollection.createIndex("properties.kioskId");
stationsCollection.createIndex("date");


exports.saveStationSnapshot = async stationData => {
    let result = await stationsCollection.insertOne(stationData, {w:1})
    return result.ops[0];
};


exports.remove = _id => stationsCollection.remove({_id});


exports.getStationSnapshot = async (kioskId, at) => {
    const stationSnapshots = await stationsCollection.aggregate([
        // Get documents with date greater than at, and koiskId
        { "$match": {
            "date": { "$gte": new Date(at) },
            "properties.kioskId": parseInt(kioskId)
        }},
        // order by kioskId and date
        { "$sort": { "date": 1 } },
        // extract only first element
        { $limit : 1 }
    ]).toArray();
    return stationSnapshots[0];
};


exports.getStationsSnapshot = async at => {
    return stationsCollection.aggregate([
        // Get documents with date greater than at
        { "$match": {
            "date": { "$gte": new Date(at) }
        }},
        // order by kioskId and date
        { "$sort": { "date": 1 } },
        // group by kioskId and extract values from first element of each group
        { "$group": {
            "_id": "$properties.kioskId", 
            "properties": { "$first": "$properties"}, 
            "geometry": {"$first": "$geometry"},
            "type": { "$first": "$type"}, 
            "date": {"$first": "$date"}
        }}
    ]).toArray();
};
