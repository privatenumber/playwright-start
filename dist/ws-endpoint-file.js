"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const WS_ENDPOINT_FILE = path_1.default.resolve(process.env.HOME, '.ws-endpoint');
exports.default = WS_ENDPOINT_FILE;
