const request = require('request-promise');
const config = require('../config.json');
const weatherDB = require('../db/weather/weather');
const logger = require('../libs/logger');

const requestOptions = {
    uri: config.OWM_API_URL,
    qs: {
        lat: config.PHILADELPHIA_LAT,
        lon: config.PHILADELPHIA_LON,
        appid: config.OWM_API_KEY
    },
    json: true
};


const saveWeatherInfo = weatherInfo => {
    weatherInfo.date = new Date();
    return weatherDB.saveWeather(weatherInfo);
};


exports.loadAndSaveData = async () => {
    try {
        let weatherInfo = await request(requestOptions);
        await saveWeatherInfo(weatherInfo);
        logger.info("End loading weather info from OWM: " + new Date());
    } catch(error) {
        logger.error("Error loading info from OWM");
        logger.error(error);
    }
};
