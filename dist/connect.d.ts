import { ChromiumBrowser, FirefoxBrowser, WebKitBrowser } from 'playwright';
declare type Browsers = ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
declare function connect<B extends Browsers>(): Promise<B>;
export = connect;
