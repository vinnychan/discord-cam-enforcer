const Keyv = require('keyv');

let camRequiredChannels = null;
let global = null;

const init = (logger) => {
    if (!global) {
        global = new Keyv('redis://localhost:6379');
        global.on('error', err => logger.error('global connection error:', err));
    }
    if (!camRequiredChannels) {
        camRequiredChannels = new Keyv('redis://localhost:6379', { namespace: 'requireCam' });
        camRequiredChannels.on('error', err => logger.error('camRequiredChannels connection error:', err));
    }
};

const getCamRequiredDbConnection = () => {
    return camRequiredChannels ? camRequiredChannels : new Keyv('redis://localhost:6379', { namespace: 'requireCam' });
};

const getGlobalDbConnection = () => {
    return global ? global : new Keyv('redis://localhost:6379');
};

module.exports = {
    init,
    getCamRequiredDbConnection,
    getGlobalDbConnection,
};