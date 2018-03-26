let mkdirp = require('mkdirp');
let logger = require('./logger');
let constants = require('../constants');

exports.createFolder = foldername => {
    mkdirp(foldername, function (err) {
        if (err) {
            logger.error(err);
        }
        else {
            logger.info("The folder " + foldername + " was created");
        }
    });
};


exports.setPhiladelphiaNoon = date => {
    // set noon localzone
    date.setHours(12 - (date.getTimezoneOffset() / 60));
    date.setMinutes(0);
    date.setSeconds(0);

    // transform to Philadelphia timezone
    return transformDateOffset(constants.PHILADELPHIA_OFFSET, date);
};


/** 
 * function to transform local date to date 
 * in a different city
 * given the city's UTC offset
 */
const transformDateOffset = exports.transformDateOffset = (offset, date) => {
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    return new Date(utc + (3600000*offset));
}
