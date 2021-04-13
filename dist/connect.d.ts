import { ChromiumBrowser } from 'playwright';
declare function connect<B extends ChromiumBrowser>(): Promise<B>;
export = connect;
