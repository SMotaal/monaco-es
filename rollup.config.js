import {map, merge, record} from './lib/common.mjs'; // reduce, record,
import {cleanFiles} from './lib/plugins/helpers.mjs';
import plugins, {css, deps, tracer, patched} from './lib/plugins/index.mjs';
import {dependencies, chunks, contributions} from './config/modules.json';

// Output
const target = 'dist';
const filenames = `[name].js`;
const minify = false;

// Input
const source = 'monaco-editor/esm';
const index = 'sources/index.mjs';
const monaco = 'sources/monaco.mjs';
const environment = 'sources/environment.mjs';
const sourcemapping = false;

// Cleanup
cleanFiles(__dirname, target);

export default {
  optimizeChunks: true,
  experimentalCodeSplitting: true,

  input: merge({index, monaco, environment}, record(contributions, resolve)),
  manualChunks: record(merge(...chunks), chunk => map(chunk, resolve)),

  output: {
    dir: target,
    format: 'es',
    sourcemap: true,
    interop: false,
    chunkFileNames: filenames,
    entryFileNames: filenames,
  },

  external: ['fs', 'path', 'events', 'module', 'util', 'crypto'],

  plugins: [
    css(),
    deps({resolve, dependencies}),
    plugins.nodeResolve({jsnext: true, module: true}),
    plugins.re({
      include: '**/vscode-css-languageservice/services/languageFacts.js',
      replaces: {
        '= this.getBrowserLabel(': '= getBrowserLabel(',
      },
    }),
    patched.commonjs(),
    minify && plugins.terser(require('./config/terser.json')),
    sourcemapping && plugins['sourcemaps?'](),
  ],
};

function resolve(specifier) {
  resolve = specifier =>
    (specifier == (specifier = `${specifier || ''}`) &&
      require.resolve(specifier.replace(/^\/vs\//, `${source}/vs/`))) ||
    '';
  return resolve(specifier);
}
