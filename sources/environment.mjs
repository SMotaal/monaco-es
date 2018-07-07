const [, ext] = /[^/]+(\.m?js)/.exec(import.meta.url);
const prefix = `languages/`;
const mappings = {};

const defaultBase = `${new URL(`.`, import.meta.url)}`;

const aliases = {
  default: 'editor',
  json: 'json',
  jsonc: 'json',
  css: 'css',
  html: 'html',
  js: 'ts',
  javascript: 'ts',
  ts: 'ts',
  typescript: 'ts'
};

const paths = {
  editor: `monaco/editor.worker${ext}`,
  css: `${prefix}css/css.worker${ext}`,
  json: `${prefix}json/json.worker${ext}`,
  html: `${prefix}html/html.worker${ext}`,
  ts: `${prefix}ts/ts.worker${ext}`,
}

const resolve = (alias, base) => {
  let mapping = mappings[alias];
  if (!mapping) {
    const name = aliases[alias] || 'editor';
    mapping = mappings[alias] = `${new URL(`./${paths[name]}`, base || defaultBase)}`;
  }
  return mapping;
};

export const getWorker = (moduleID, label, base) => {
  const name = aliases[label] || aliases.default;
  const mapping = resolve(name, base);
  console.log('getWorker', { moduleID, label, name, mapping });
  return new Worker(mapping, { type: 'module' });
};

export default (base = defaultBase) => ({
  base,
  getWorker(moduleID, label) {
    return getWorker(moduleID, label, this.base);
  },
});


// const defaultBase =
//   ('string' === typeof origin && origin) ||
//   import.meta.url.replace(/^(.*?)\/[^\/]*?/, '$1');
