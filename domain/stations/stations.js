
const config = require('../../config.json');
const constants = require('../../constants');
const logger = require('../../libs/logger');
const utils = require('../../libs/utils');
const stationsDB = require('../../db/stations/stations');
const weatherDB = require('../../db/weather/weather');


const getStationSnapshotAt = exports.getStationSnapshotAt = async (kioskId, at) => {
    const snapshot = await stationsDB.getStationSnapshot(kioskId, at);
    if(!snapshot) throw "Not station data available at " + at + " for kioskId " + kioskId;
    const weather = await weatherDB.getWeatherSnapshot(at);
    if(!weather) throw "Not weather data available at " + at;

    // extract actual time of snapshot
    at = weather.date;
    return {at, snapshot, weather};
};


const getStationsSnapshot = exports.getStationsSnapshot = async at => {
    const snapshots = await stationsDB.getStationsSnapshot(at);
    if(!snapshots) throw "Not stations data available at " + at;
    const weather = await weatherDB.getWeatherSnapshot(at);
    if(!weather) throw "Not weather data available at " + at;

    // extract actual time of snapshot
    at = weather.date;
    return {at, snapshots, weather};
};


exports.getStationsSnapshotsRange = async (kioskId, from, to, frequency) => {
    let numSnapshots = 0;
    let numErrors = 0;
    let snapshots = [];
    let snapshot;

    while((from < to) && (numSnapshots < config.MAX_NUM_SNAPSHOTS_RESPONSE) && (numErrors < 20)) {
        try {
            snapshot = await getStationSnapshotAt(kioskId, from);
            //make sure snapshot is into range
            if(snapshot.at > to) {
                break;
            }
            snapshots.push(snapshot);
            ++numSnapshots;

            // set from to snapshot date, avoid problems in case some hour or day did not get any data from API
            from = new Date(snapshot.at);
        } catch(error) {
            logger.silly("Not data for date: " + from);
        }
        from = getNextDateToRequest(from, frequency);
    }

    return snapshots;
};


const getNextDateToRequest = (lastDate, frequency) => {
    lastDate = new Date(lastDate);
    // hourly by default
    if(frequency === constants.FREQUENCY_DAILY) {
        // calculate next day at noon in Philadelphia
        lastDate.setDate(lastDate.getDate() + 1);
        lastDate = utils.setPhiladelphiaNoon(lastDate);
    } else {
        lastDate.setHours(lastDate.getHours() + 1);
        lastDate.setMinutes(0);
    }
    return lastDate;
};
