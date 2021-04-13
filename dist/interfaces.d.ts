export declare const BROWSERS: readonly ["chromium", "firefox", "webkit"];
export declare type BrowserType = typeof BROWSERS[number];
export interface WsEndpointData {
    pid: number;
    wsEndpoint: string;
    browserType: BrowserType;
}
