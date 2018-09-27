# Monaco ES _alpha_

Configurable Monaco Editor (ECMAScript) modules using Rollup

## Getting Started

```sh
yarn add monaco-es
```

## Changes

### Version 0.0.7

***Reminder**: this is all extremely experimental*

- Resolved various issues — only works in Chrome for now
  > Requires Module support in Workers

- Updated references in `static/monaco-es.html` — tested with [`http-server`](https://www.npmjs.com/package/http-server)

  > Serving from `monaco-es` will resolve at `/static/monaco-es.html`

- Published as experimental — [Notes](https://github.com/SMotaal/experimental/blob/master/monaco-es.md)

### Version 0.0.6

- Add type definitions to top-level build modules

- Add `dist/standalone.js` for finer-grained service overrides

### Version 0.0.5

- Add `serve-monaco-es` bin which will [automatically serve files from process.cwd()](https://github.com/SMotaal/monaco-es/issues/2) to allow experimental testing with monaco-es as a dependency.

- Add test package with [postinstall hook to build on install](https://github.com/SMotaal/monaco-es/issues/1) to mitigate a specific issue where build does not get triggered when installing from "../".

## Known Issues

- Workers: so far `new Worker(…, {type: 'module'})` supported in Chrome only
- [ESM: this === undefined in "esm/vs/language/css/languageFeatures.js" and possibly others](https://github.com/Microsoft/monaco-editor/issues/945)
