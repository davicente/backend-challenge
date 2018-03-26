
const assert = require('chai').assert;
const expect = require('chai').expect;
const constants = require('../../../constants');
let stationsDB;
let weatherDB;
let stationsDomain;

const kioskIdTesting = 3163;
const dateTesting = "2018-03-25T17:01:01";

describe('Stations', () => {

    before( () => {
        stationsDomain = require('../../../domain/stations/stations');
        stationsDB = require('../../../db/stations/stations');
        weatherDB = require('../../../db/weather/weather');
    });

    
    describe('Get', () => {
        let stationIds, weatherIds;

        before(function (done) {
            this.timeout(10000);
            fillStationsCollection()
            .then(ids => {
                stationIds = ids;
                return fillWeatherCollection();
            })
            .then(ids => {
                weatherIds = ids;
                done();
            })
        });

        after(async () => {
            for(let stationId of stationIds) {
                await stationsDB.remove(stationId);
            }
            for(let weatherId of weatherIds) {
                await weatherDB.remove(weatherId);
            }
        });

        it('Get station snapshot', async () => {
            let snapshot = await stationsDomain.getStationSnapshotAt(kioskIdTesting, dateTesting);
            assert.strictEqual(snapshot.snapshot.properties.kioskId, kioskIdTesting);
            expect(new Date(snapshot.at)).to.be.at.least(new Date(dateTesting));
            expect(new Date(snapshot.weather.date)).to.be.at.least(new Date(dateTesting));            
        });

        it('Get station daily snapshots', async () => {
            let dateTo = new Date(dateTesting).setDate(new Date(dateTesting).getDate() + 10);
            let snapshots = await stationsDomain.getStationsSnapshotsRange(dateTesting, dateTo, constants.FREQUENCY_DAILY);
            expect(snapshots).to.be.an('array');
            for(let snapshot of snapshots) {
                expect(new Date(snapshot.at)).to.be.at.least(new Date(dateTesting));
                expect(new Date(snapshot.weather.date)).to.be.at.least(new Date(dateTesting));
                expect(snapshot.snapshots).to.be.an('array');
                expect(snapshot.snapshots.length).to.be.at.least(3);
                assert.ok(snapshot.snapshots.some(snapshot => snapshot.properties.kioskId == kioskIdTesting));
            }
        });

        it('Get station hourly snapshots', async () => {
            let dateTo = new Date(dateTesting).setDate(new Date(dateTesting).getDate() + 10);
            let snapshots = await stationsDomain.getStationsSnapshotsRange(dateTesting, dateTo, constants.FREQUENCY_HOURLY);
            expect(snapshots).to.be.an('array');
            for(let snapshot of snapshots) {
                expect(new Date(snapshot.at)).to.be.at.least(new Date(dateTesting));
                expect(new Date(snapshot.weather.date)).to.be.at.least(new Date(dateTesting));
                expect(snapshot.snapshots).to.be.an('array');
                expect(snapshot.snapshots.length).to.be.at.least(3);
                assert.ok(snapshot.snapshots.some(snapshot => snapshot.properties.kioskId == kioskIdTesting));
            }
        });
    });
});


const fillWeatherCollection = async () => {
    const weatherData = {
        "coord": {
            "lon": -75.16,
            "lat": 39.95
        },
        "weather": [
            {
                "id": 804,
                "main": "Clouds",
                "description": "overcast clouds",
                "icon": "04n"
            }
        ],
        "base": "stations",
        "main": {
            "temp": 271.95,
            "pressure": 1024,
            "humidity": 63,
            "temp_min": 271.15,
            "temp_max": 273.15
        },
        "visibility": 16093,
        "wind": {
            "speed": 3.37,
            "deg": 5.50409
        },
        "clouds": {
            "all": 90
        },
        "dt": 1521974100,
        "sys": {
            "type": 1,
            "id": 2361,
            "message": 0.0043,
            "country": "US",
            "sunrise": 1521975312,
            "sunset": 1522019896
        },
        "id": 4560349,
        "name": "Philadelphia",
        "cod": 200,
        "date": new Date("2018-03-25T21:03:00.517Z")
    };

    let weather = await weatherDB.saveWeather(weatherData);
    return [weather._id];
};


const fillStationsCollection = async () => {
    const stationsData = [
        {
            "properties": {
                "addressStreet": "151 Race St",
                "addressCity": "Philadelphia",
                "addressState": "PA",
                "addressZipCode": "19106",
                "bikesAvailable": 12,
                "closeTime": "23:58:00",
                "docksAvailable": 4,
                "eventEnd": null,
                "eventStart": null,
                "isEventBased": false,
                "isVirtual": false,
                "isVisible": false,
                "kioskId": 3169,
                "kioskPublicStatus": "Active",
                "kioskStatus": "FullService",
                "name": "2nd & Race",
                "notes": null,
                "openTime": "00:02:00",
                "publicText": "",
                "timeZone": "Eastern Standard Time",
                "totalDocks": 17,
                "trikesAvailable": 0,
                "kioskConnectionStatus": "Active",
                "kioskType": 1,
                "latitude": 39.95382,
                "longitude": -75.14263,
                "hasGeofence": false
            },
            "geometry": {
                "coordinates": [
                    -75.14263,
                    39.95382
                ],
                "type": "Point"
            },
            "type": "Feature",
            "date": new Date("2018-03-25T21:01:01.352Z")
        },
        {
            "properties": {
                "addressStreet": "229 S. 25th Street ",
                "addressCity": "Philadelphia",
                "addressState": "PA",
                "addressZipCode": "19122",
                "bikesAvailable": 8,
                "closeTime": "23:58:00",
                "docksAvailable": 13,
                "eventEnd": null,
                "eventStart": null,
                "isEventBased": false,
                "isVirtual": false,
                "isVisible": false,
                "kioskId": 3163,
                "kioskPublicStatus": "Active",
                "kioskStatus": "FullService",
                "name": "25th & Locust",
                "notes": null,
                "openTime": "00:02:00",
                "publicText": "",
                "timeZone": "Eastern Standard Time",
                "totalDocks": 21,
                "trikesAvailable": 0,
                "kioskConnectionStatus": "Active",
                "kioskType": 1,
                "latitude": 39.94974,
                "longitude": -75.18097,
                "hasGeofence": false
            },
            "geometry": {
                "coordinates": [
                    -75.18097,
                    39.94974
                ],
                "type": "Point"
            },
            "type": "Feature",
            "date": new Date("2018-03-25T21:01:01.348Z")
        },
        {
            "properties": {
                "addressStreet": "3810 Market St.",
                "addressCity": "Philadelphia",
                "addressState": "PA",
                "addressZipCode": "19104",
                "bikesAvailable": 3,
                "closeTime": "23:58:00",
                "docksAvailable": 35,
                "eventEnd": null,
                "eventStart": null,
                "isEventBased": false,
                "isVirtual": false,
                "isVisible": false,
                "kioskId": 3160,
                "kioskPublicStatus": "Active",
                "kioskStatus": "FullService",
                "name": "38th & Market",
                "notes": null,
                "openTime": "00:02:00",
                "publicText": "",
                "timeZone": "Eastern Standard Time",
                "totalDocks": 39,
                "trikesAvailable": 0,
                "kioskConnectionStatus": "Active",
                "kioskType": 1,
                "latitude": 39.95662,
                "longitude": -75.19862,
                "hasGeofence": false
            },
            "geometry": {
                "coordinates": [
                    -75.19862,
                    39.95662
                ],
                "type": "Point"
            },
            "type": "Feature",
            "date": new Date("2018-03-25T21:01:01.346Z")
        }
    ];

    let stationIds = [];
    let station;
    for(let stationData of stationsData) {
        station = await stationsDB.saveStationSnapshot(stationData);
        stationIds.push(station._id);
    }
    return stationIds;
};
