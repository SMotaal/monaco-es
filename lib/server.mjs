#!/usr/bin/env node --experimental-modules

import express from 'express';
import path from 'path';
import {map, reduce, values} from './common.mjs';

const app = express();

// TODO: Update when path supports file:// names
const base = path.resolve(import.meta.url.slice(7), '../..');
const absolute = (...segments) => path.resolve(base, ...segments);

const statics = {};

const cwd = process.cwd();
const root = absolute('static');

if (cwd !== root) {
  const handler = express.static(cwd);
  const entry = '/';
  statics.cwd = { entry, root: cwd, handler };
  // app.use(entry, handler);
}

Object.assign(statics, {
  root: { entry: '/', root},
  dist: { entry: '/node_modules/monaco-es/dist' }, // root: absolute('dist')
  lib: {}, // entry: '/lib', root: absolute('lib')
});

for (const k in statics) {
  const {
    entry = statics[k].entry = `/${k}`,
    root = statics[k].root = absolute(k),
    options,
    handler = statics[k].handler = express.static(root, options),
  } = statics[k];
  app.use(entry, handler);
}



const server = app.listen(8080, () => {
  const address = server.address();
  console.log('Listening', address, statics);
});

// subprocess.execSync('npx http-server -g', {
//   cwd: root,
// });

// const app = express();

// app.use(express.static(''))

// const statics = reduce(
//   ['build', 'lib'],
//   (p, k) => ((p[k] = absolute(root, k)), p),
//   {},
// );

// // handler: express.static(root)

// app.use(statics.root.handler);

// for (const k of ['dist', 'lib']) {
//   const entry = `/${k}`;
//   const root = absolute(k);
//   const handler = express.static(root);
//   statics[k] = {entry, root, handler};
//   app.use(entry, handler);
// }
