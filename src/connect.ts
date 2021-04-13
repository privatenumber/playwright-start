import fs from 'fs';
import assert from 'assert';
import playwright, { BrowserType, ChromiumBrowser } from 'playwright';
import WS_ENDPOINT_FILE from './ws-endpoint-file';
import { WsEndpointData } from './interfaces';

async function readWsEndpointFile(): Promise<WsEndpointData> {
	return JSON.parse((await fs.promises.readFile(WS_ENDPOINT_FILE)).toString());
}

async function connect<B extends ChromiumBrowser>(): Promise<B> {
	assert(
		fs.existsSync(WS_ENDPOINT_FILE),
		'Browser not initialized. Run `playwright-start` in a separate terminal.',
	);

	const {
		wsEndpoint,
		browserType,
	} = await readWsEndpointFile();

	const browser = playwright[browserType] as BrowserType<B>;
	return await browser.connect({
		wsEndpoint,
	});
}

export = connect;
