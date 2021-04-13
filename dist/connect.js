"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const assert_1 = __importDefault(require("assert"));
const playwright_1 = __importDefault(require("playwright"));
const ws_endpoint_file_1 = __importDefault(require("./ws-endpoint-file"));
async function readWsEndpointFile() {
    return JSON.parse((await fs_1.default.promises.readFile(ws_endpoint_file_1.default)).toString());
}
async function connect() {
    assert_1.default(fs_1.default.existsSync(ws_endpoint_file_1.default), 'Browser not initialized. Run `playwright-start` in a separate terminal.');
    const { wsEndpoint, browserType, } = await readWsEndpointFile();
    const browser = playwright_1.default[browserType];
    return await browser.connect({
        wsEndpoint,
    });
}
module.exports = connect;
