const path = require('path');

const WS_ENDPOINT_FILE = path.resolve(process.env.HOME, '.ws-endpoint');

module.exports = WS_ENDPOINT_FILE;
