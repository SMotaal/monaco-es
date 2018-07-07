#!/usr/bin/env node --experimental-modules

import fs from 'fs';
import url from 'url';
import subprocess from 'child_process';

const cwd = new url.URL('..', import.meta.url).pathname;
const stdio = 'inherit';

if (/\/node_modules\/monaco-es\/?$/.test(cwd))
  subprocess.execSync(`yarn build`, {cwd, stdio});
