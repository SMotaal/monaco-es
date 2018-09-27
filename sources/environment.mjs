const preferences = {
  // classic: true,
  // dynamic: true,
};

const platform = (typeof navigator === 'object' && {
  chrome: typeof chrome === 'object',
  safari: /Version\/.* Safari\//.test(navigator.userAgent),
}) || {node: typeof process === 'object' && process.versions && 'node' in process.versions};

const supports = (platform.supports = {
  modules: platform.chrome || platform.safari,
  static: platform.chrome,
});

const MODULES = supports.modules && !preferences.classic; // platform.modules
const DYNAMIC = !supports.static || preferences.dynamic; // !MODULES || preferences.dynamic;
const OPTIONS = {type: MODULES ? 'module' : 'classic', platform, preferences};

const [, EXT] = /[^/]+(\.m?js)/.exec(import.meta.url);

const {Log, CurrentScope} = Debugging();

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
  typescript: 'ts',
};

const paths = {
  editor: `monaco/editor.worker${EXT}`,
  css: `${prefix}css/css.worker${EXT}`,
  json: `${prefix}json/json.worker${EXT}`,
  html: `${prefix}html/html.worker${EXT}`,
  ts: `${prefix}ts/ts.worker${EXT}`,
};

const resolve = (alias, base) => {
  let mapping = mappings[alias];
  if (!mapping) {
    const name = aliases[alias] || 'editor';
    mapping = mappings[alias] = `${new URL(`./${paths[name]}`, base || defaultBase)}`;
  }
  return mapping;
};

const getWorker = (moduleID, label, base, dynamic = DYNAMIC) => {
  const mode = aliases[label] || aliases.default;
  const src = resolve(mode, base);
  const url = getWorkerURL(base, src, dynamic);
  const options = OPTIONS;
  const worker = new Worker(url, options);
  Log(() => ['getWorker(%o, %o) => %O', moduleID, label, {worker, mode, src, url, options}]);
  return worker;
};

const getWorkerURL = (base, src, dynamic = DYNAMIC) => {
  return dynamic ? `${new URL(`./worker${EXT}`, base)}#${src.replace(base, '')}` : `${src}`;
}

var environment = (base = defaultBase) => ({
  base,
  getWorker(moduleID, label) {
    return getWorker(moduleID, label, this.base);
  },
});

function Debugging() {
  const {setPrototypeOf, defineProperties, defineProperty, freeze} = Object;
  const debugging = {};
  const namespace = {};
  const noop = freeze(a => a);
  const configurable = true;

  Debugging = () => debugging;

  const imports = import(`./debugging${EXT}`)
    .then(imports => {
      const descriptors = {};
      for (const k in imports) descriptors[k] = {get: () => namespace[k], configurable};
      defineProperties(debugging, descriptors);
      return setPrototypeOf(namespace, imports);
    })
    .catch(r => console.warn(r) || namespace);

  const apply = async (k, args) => {
    const [n, ...p] = await Promise.all([imports, ...(await args)]);
    return Reflect.apply(namespace[k] || noop, null, p);
  };

  const proxy = new Proxy(setPrototypeOf(new class Debugging {}(), null), {
    get: (t, k) =>
      (k &&
        typeof k === 'string' &&
        defineProperty(debugging, k, {
          value: ƒ => apply(k, ƒ()),
          configurable,
        })[k]) ||
      noop,
  });

  return setPrototypeOf(debugging, proxy);
}

export default environment;
export {Log, CurrentScope, getWorker};
