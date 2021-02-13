const fs = require('fs');
const playwright = require('playwright');
const WS_ENDPOINT_FILE = require('./ws-endpoint-file.js');

async function connect(options) {
	if (!fs.existsSync(WS_ENDPOINT_FILE)) {
		return;
	}

	if (options) {
		console.warn('Browser server found. Options will not be applied');
	}

	const {
		wsEndpoint,
		browserType,
	} = JSON.parse((await fs.promises.readFile(WS_ENDPOINT_FILE)).toString());

	return await playwright[browserType].connect({ wsEndpoint });
}

module.exports = connect;
