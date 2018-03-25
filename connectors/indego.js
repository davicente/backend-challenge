const request = require('request-promise');
const config = require('../config.json');
const stationsDB = require('../db/stations/stations');
const logger = require('../libs/logger');

const requestOptions = {
    uri: config.INDEGO_URL,
    json: true
};


const saveStationSnapshot = stationInfo => {
    stationInfo.date = new Date();
    return stationsDB.saveStationSnapshot(stationInfo);
};


exports.loadAndSaveData = async () => {
    try {
        let stationsInfo = await request(requestOptions);
        for(let stationInfo of stationsInfo.features) {
            await saveStationSnapshot(stationInfo);
        }
        logger.info("End loading Indego info: " + new Date());
    } catch(error) {
        logger.error("Error loading info from Indego");
        logger.error(error);
    }
};
