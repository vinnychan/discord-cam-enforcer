const Keyv = require('keyv');
const Logger = require('../logger');

let camRequiredChannels = null;
let global = null;

const init = () => {
    if (!global) {
        global = new Keyv('redis://localhost:6379');
        global.on('error', err => Logger.error('global connection error:', err));
    }
    if (!camRequiredChannels) {
        camRequiredChannels = new Keyv('redis://localhost:6379', { namespace: 'requireCam' });
        camRequiredChannels.on('error', err => Logger.error('camRequiredChannels connection error:', err));
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