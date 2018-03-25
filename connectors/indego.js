const request = require('request-promise');
const config = require('../config.json');
const docksDB = require('../db/docks/docks');
const logger = require('../libs/logger');

const requestOptions = {
    uri: config.INDEGO_URL,
    json: true
};


const saveDockInfo = dockInfo => {
    dockInfo.date = new Date();
    return docksDB.saveDockSnapshot(dockInfo);
};


exports.loadAndSaveData = async () => {
    try {
        let docksInfo = await request(requestOptions);
        for(let dockInfo of docksInfo.features) {
            await saveDockInfo(dockInfo);
        }
        logger.info("End loading Indego info: " + new Date());
    } catch(error) {
        logger.error("Error loading info from Indego");
        logger.error(error);
    }
};
