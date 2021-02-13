# playwright-start [![Latest version](https://badgen.net/npm/v/playwright-start)](https://npm.im/playwright-start) [![Monthly downloads](https://badgen.net/npm/dm/playwright-start)](https://npm.im/playwright-start) [![Install size](https://packagephobia.now.sh/badge?p=playwright-start)](https://packagephobia.now.sh/result?p=playwright-start)

Start a long-running [playwright](https://playwright.dev) browser server via CLI.

<sub>If you like this project, please star it & [follow me](https://github.com/privatenumber) to see what other cool projects I'm working on! ❤️</sub>

## 🙋‍♂️ Why?
When developing browser automation scripts, there's a lot of overhead in browser start up every time you test a change.

Start a long-running browser server in a separate window and connect to it from your script to iterate faster! The CLI also comes with a [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) to help you quickly test code.

## 🚀 Install
```sh
npm i -D playwright-start
```

## 🚦 Quick Setup
Start a browser server:
```sh
npx playwright-start
```

Connect to it from your code:
```js
const connect = require('playwright-start')

const browser = await connect()
```
