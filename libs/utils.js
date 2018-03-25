let mkdirp = require('mkdirp');
let logger = require('./logger');

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
