const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const logger = require('../../libs/logger');
const utilsDB = require('../db');

const db = utilsDB.getDBConexion()
const weatherCollection = db.collection('weather');
logger.info('Collection weather');

// Create indexes
weatherCollection.createIndex("date");


exports.saveWeather = async weatherInfo => {
    let result = await weatherCollection.insertOne(weatherInfo, {w:1})
    return result.ops[0];
};


exports.remove = _id => weatherCollection.remove({_id});


exports.getWeatherSnapshot = async at => {
    let weatherSnapshots = await weatherCollection.aggregate([
        // Get documents with date greater than at
        { "$match": {
            "date": { "$gte": new Date(at) }
        }},
        // order by date
        { "$sort": { "date": 1 } },
        // extract only first element
        { $limit : 1 }
    ]).toArray();
    return weatherSnapshots[0];
};
