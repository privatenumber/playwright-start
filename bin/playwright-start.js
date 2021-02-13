#!/usr/bin/env node

const fs = require('fs');
const repl = require('repl');
const assert = require('assert');
const playwright = require('playwright');
const exitHook = require('exit-hook');
const cac = require('cac');
const WS_ENDPOINT_FILE = require('../lib/ws-endpoint-file.js');
const packageJson = require('../package.json');

const possibleBrowserTypes = ['chromium', 'firefox', 'webkit'];

async function launchServer(browser, options) {
	const browserServer = await browser.launchServer(options);
	const { pid } = browserServer.process();
	const wsEndpoint = browserServer.wsEndpoint();

	await fs.promises.writeFile(WS_ENDPOINT_FILE, JSON.stringify({
		pid,
		wsEndpoint,
		browserType: browser._initializer.name,
	}));

	exitHook(() => fs.unlinkSync(WS_ENDPOINT_FILE));

	return browserServer;
}

(async () => {
	const cli = cac('start-browser')
		.usage('[browser]')
		.option('--headless', 'Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.', {
			type: Boolean,
		})
		.option('--devtools', 'Chromium-only Whether to auto-open a Developer Tools panel for each tab. If this option is true, the headless option will be set false.', {
			type: Boolean,
		})
		.help()
		.version(packageJson.version);

	const parsed = cli.parse();

	if (parsed.options.help || parsed.options.version) {
		process.exit(0);
	}

	const [browserTypeName = possibleBrowserTypes[0]] = parsed.args;

	assert(possibleBrowserTypes.includes(browserTypeName), `Browser type "${browserTypeName}" is not supported.`);

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
