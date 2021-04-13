"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const repl_1 = __importDefault(require("repl"));
const assert_1 = __importDefault(require("assert"));
const playwright_1 = __importDefault(require("playwright"));
const exit_hook_1 = __importDefault(require("exit-hook"));
const cac_1 = __importDefault(require("cac"));
const ws_endpoint_file_1 = __importDefault(require("./ws-endpoint-file"));
const interfaces_1 = require("./interfaces");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json');
async function launchServer(browser, options) {
    const browserServer = await browser.launchServer(options);
    const wsEndpointData = {
        pid: browserServer.process().pid,
        wsEndpoint: browserServer.wsEndpoint(),
        // @ts-expect-error hidden property
        browserType: browser._initializer.name,
    };
    await fs_1.default.promises.writeFile(ws_endpoint_file_1.default, JSON.stringify(wsEndpointData));
    exit_hook_1.default(() => fs_1.default.unlinkSync(ws_endpoint_file_1.default));
    return browserServer;
}
function validateBrowserType(browserTypeName) {
    return interfaces_1.BROWSERS.includes(browserTypeName);
}
(async () => {
    const cli = cac_1.default('start-browser')
        .usage('[browser]')
        .option('--headless', 'Whether to run browser in headless mode. More details for Chromium and Firefox. Defaults to true unless the devtools option is true.', {
        // TODO: Remove array once this is done https://github.com/cacjs/cac/issues/106
        type: [Boolean],
    })
        .option('--devtools', 'Chromium-only Whether to auto-open a Developer Tools panel for each tab. If this option is true, the headless option will be set false.', {
        // TODO: Remove array once this is done https://github.com/cacjs/cac/issues/106
        type: [Boolean],
    })
        .help()
        .version(packageJson.version);
    const parsed = cli.parse();
    if (parsed.options.help || parsed.options.version) {
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
    }
    [parsed.options.headless] = parsed.options.headless;
    [parsed.options.devtools] = parsed.options.devtools;
    const [browserTypeName = interfaces_1.BROWSERS[0]] = parsed.args;
    assert_1.default(validateBrowserType(browserTypeName), `Browser type "${browserTypeName}" is not supported.`);
    const browserType = playwright_1.default[browserTypeName];
    const browserServer = await launchServer(browserType, parsed.options);
    const browser = await browserType.connect({
        wsEndpoint: browserServer.wsEndpoint(),
    });
    const replServer = repl_1.default.start({
        useColors: true,
        preview: true,
    });
    replServer.context.browser = browser;
    replServer.on('exit', () => browserServer.close());
})();
