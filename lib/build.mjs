#!/usr/bin/env node --experimental-modules

import fs from 'fs';
import url from 'url';
import path from 'url';
import subprocess from 'child_process';
import util from 'util';

const debugging = false;
const command = 'yarn build';
const stdio = 'inherit';
const cwd = new url.URL('..', import.meta.url).pathname;
const rebuild = process.argv.includes('--rebuild');
const force = process.argv.includes('--force-build-monaco-es');
// console.log(cwd);

if (rebuild || force || /\/node_modules\/monaco-es\/?$/.test(cwd)) {
  build().then(code => process.exit(code || 0));
}

async function build() {
  const dist = path.resolve(cwd, 'dist/');
  const stubPath = path.resolve(dist, 'stub.json');

  // return console.log({cwd, dist, stubPath});

  const stub = (await importJSON(stubPath)) || {};
  const args = {stdio, cwd};
  const tagline = '[monaco-es]:build:';

  let built;

  // TODO: Implement optimisitic building
  // const optimisitic = !stub.versions;
  // if (optimisitic) built = exec(command, args);

  const {changes, problems} = await preflight(stub);

  debugging && console.log(`%s: %o`, stubPath, {stub, changes, problems});

  if (problems.length) {
    console.error(`${tagline}preflight:problems: %o`, problems);
    return -1;
  }

  if (!force && !changes.length && !built) {
    return console.info(`${tagline} up-to-date`);
  }

  console.group(`${tagline}`);

  try {
    built = subprocess.execSync(command, args);
    //await (built || (built = exec(command, args)));

    const stamp = new Date();

    fs.writeFileSync(
      stubPath,
      JSON.stringify({
        stamp,
        ...stub,
      }),
    );

    console.log(`√ Done`);
  } finally {
    console.groupEnd();
  }
}

function exec(...args) {
  return (exec = util.promisify(subprocess.exec))(...args);
}

async function preflight(stub) {
  // const stub = readJSON(stubPath) || {};
  const changes = [];
  const problems = [];
  const versions = stub.versions || (stub.versions = {});
  const packages = [
    'monaco-es',
    'monaco-editor',
    'vscode-languageserver-types',
    // 'rollup',
  ];

  for (const id of packages) {
    const specifier = id === 'monaco-es' ? `./../package.json` : `${id}/package.json`;
    const stubVersion = versions[id];
    const info = await importJSON(specifier);
    const version = info && info.version;
    const issue = (!info && 'missing package.json') || (!version && 'missing version');
    if (issue) {
      problems.push({[id]: issue});
      continue;
    }

    versions[id] = version;
    stubVersion === version || changes.push([id, 'version', stubVersion, version]);
    // if (!stubVersion || version !== stubVersion)
  }

  return {stub, changes, problems};
}

async function importJSON(specifier) {
  try {
    const json = await import(specifier);
    return (json && json.default) || json || undefined;
  } catch (exception) {}
}

function readJSON(pathname) {
  try {
    readJSON = process.binding('fs').internalModuleReadJSON;
  } catch (exception) {
    readJSON = pathname => {
      try {
        return JSON.parse(fs.readFileSync(pathname));
      } catch (exception) {
        return undefined;
      }
    };
  }
  return readJSON(pathname);
}

//   const stub = readJSON(stubPath) || {};
//   const versions = stub.versions || {};

//   if (sub.versions) {

//     for (const id of  packages) {
//       const specifier = `${id}/package.json`;
//       const info = readJSON(specifier);
//       const version = info && info.version;
//       let problem = !info ? fs.existsSync()
//       if (!info || !version) {
//         problems.push({package: id, issue: 'invalid package.json', info, specifier});
//         continue;
//       } else if (!info.version)
//       (versions[id] = info.version) === stub.versions[id]
//       if ()
//     }
//     const versions = require('monaco-editor/package.json');
//   }

// }
