
var db = require('../db/db');
var config = require('../config.json');


describe('Domain', () => {

    before(() => {
        //create db conection
        return db.initializeDB();
    });

    describe("Domain tests", () => {
        require("./domain/stations/stations");
    });
});
