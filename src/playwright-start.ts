import fs from 'fs';
import repl from 'repl';
import assert from 'assert';
import playwright, { BrowserType as PlaywrightBrowserType } from 'playwright';
import exitHook from 'exit-hook';
import cac from 'cac';
import WS_ENDPOINT_FILE from './ws-endpoint-file.js';
import {
	BROWSERS,
	BrowserType,
	WsEndpointData,
} from './interfaces';

const packageJson = require('../package.json');

async function launchServer<Browser>(
	browser: PlaywrightBrowserType<Browser>,
	options: Parameters<PlaywrightBrowserType<Browser>["launchServer"]>[0],
) {
	const browserServer = await browser.launchServer(options);
	const wsEndpointData: WsEndpointData = {
		pid: browserServer.process().pid,
		wsEndpoint: browserServer.wsEndpoint(),
		// @ts-expect-error
		browserType: browser._initializer.name,
	};

	await fs.promises.writeFile(WS_ENDPOINT_FILE, JSON.stringify(wsEndpointData));
	exitHook(() => fs.unlinkSync(WS_ENDPOINT_FILE));

	return browserServer;
}

function validateBrowserType(browserTypeName: string): browserTypeName is BrowserType {
	return (BROWSERS as ReadonlyArray<string>).includes(browserTypeName);
}

(async () => {
	const cli = cac('start-browser')
		.usage('[browser]')
		.option(
			'--headless',
			'Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.',
			{
				// TODO: Remove array once this is done https://github.com/cacjs/cac/issues/106
				type: [Boolean],
			}
		)
		.option(
			'--devtools',
			'Chromium-only Whether to auto-open a Developer Tools panel for each tab. If this option is true, the headless option will be set false.',
			{
				// TODO: Remove array once this is done https://github.com/cacjs/cac/issues/106
				type: [Boolean],
			},
		)
		.help()
		.version(packageJson.version);

	const parsed = cli.parse();

	if (parsed.options.help || parsed.options.version) {
		process.exit(0);
	}

	parsed.options.headless = parsed.options.headless[0];
	parsed.options.devtools = parsed.options.devtools[0];

	const [browserTypeName = BROWSERS[0]] = parsed.args;

	assert(
		validateBrowserType(browserTypeName),
		`Browser type "${browserTypeName}" is not supported.`,
	);

	const browserType = playwright[browserTypeName];
	const browserServer = await launchServer(browserType, parsed.options);
	const browser = await browserType.connect({
		wsEndpoint: browserServer.wsEndpoint(),
	});

	const replServer = repl.start({
		useColors: true,
		preview: true,
	});
	replServer.context.browser = browser;
	replServer.on('exit', () => browserServer.close());
})();
