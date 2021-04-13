export const BROWSERS = ['chromium', 'firefox', 'webkit'] as const;
export type BrowserType = typeof BROWSERS[number];

export interface WsEndpointData {
	pid: number;
	wsEndpoint: string;
	browserType: BrowserType;
}
