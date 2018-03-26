const Router = require('express').Router;
const constants = require('../../constants');
const logger = require('../../libs/logger');
const stationsDomain = require('../../domain/stations/stations');


exports.loadRoutes = () => {
    let api = Router();

    api.get('/:kioskId', getSnapshotStation);
    api.get('', getSnapshotsStations);

    return api;
};


const getSnapshotStation = async (req, res, next) => {
    try {
        let kioskId = req.params.kioskId;
        let at = req.query.at;
        let from = req.query.from;
        let to = req.query.to;
        let frequency = req.query.frequency;
        if(at) {
            const snapshot = await stationsDomain.getStationSnapshotAt(kioskId, at);
            return res.send(snapshot);
        } else if(from && to && frequency) {
            frequency = frequency.toLowerCase() === constants.FREQUENCY_DAILY.toLowerCase() ? constants.FREQUENCY_DAILY: constants.FREQUENCY_HOURLY;
            const snapshots = await stationsDomain.getStationsSnapshotsRange(kioskId, new Date(from), new Date(to), frequency);
            return res.send(snapshots);
        } else {
            res.status(400).send();
        }
    } catch (error) {
        logger.debug(error);
        res.status(404).send();
    } 
};


const getSnapshotsStations = async (req, res, next) => {
    try {
        const at = req.query.at;
        const snapshots = await stationsDomain.getStationsSnapshot(at);
        res.send(snapshots);
    } catch (error) {
        logger.debug(error);
        res.status(404).send();
    }
};