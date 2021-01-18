const Winston = require('winston');

const logger = Winston.createLogger({
    transports: [
        new Winston.transports.Console(),
        // new Winston.transports.File({ filename: 'log' }), // writes to file
    ],
    format: Winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
});

const get = () => {
    return logger;
};

module.exports = {
    get,
};