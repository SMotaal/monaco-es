import {map, merge, record} from './lib/common.mjs'; // reduce, record,
import {cleanFiles} from './lib/plugins/helpers.mjs';
import plugins, {css, deps, tracer, patched} from './lib/plugins/index.mjs';
import {dependencies, chunks, contributions} from './config/modules.json';

// Output
const target = 'dist';
const filenames = `[name].js`;
const minify = false;

// Input
const distribution = 'monaco-editor/esm';
const sources = {
  index: 'sources/index.mjs',
  monaco: 'sources/monaco.mjs',
  environment: 'sources/environment.mjs',
  debugging: 'sources/debugging.mjs',
  worker: 'sources/worker.mjs',
};
const sourcemapping = false;

// Cleanup
cleanFiles(__dirname, target);

export default {
  optimizeChunks: true,
  experimentalCodeSplitting: true,

  input: merge(sources, record(contributions, resolve)),
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
    patched.commonjs(),
    plugins.re({
      replaces: {
        'browserLabel = this.getBrowserLabel(entry.browsers)': 'browserLabel = getBrowserLabel(entry.browsers)',
      },
    }),
    minify && plugins.terser(require('./config/terser.json')),
    sourcemapping && plugins['sourcemaps?'](),
  ],
};

function resolve(specifier) {
  resolve = specifier =>
    (specifier == (specifier = `${specifier || ''}`) &&
      require.resolve(specifier.replace(/^\/vs\//, `${distribution}/vs/`))) ||
    '';
  return resolve(specifier);
}
