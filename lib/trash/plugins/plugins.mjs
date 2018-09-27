import Module from 'module';

const unwrap = (name, module) =>
  ('function' !== typeof module &&
    (('function' === typeof module.default && module.default) ||
      ('function' === typeof module[name] && module[name]))) ||
  module;

const plugins = name =>
  plugins[name] ||
  (plugins[name] = unwrap(
    name,
    plugins.require(
      `rollup-plugin-${name.replace(/([a-z])(?=[A-Z])/g, '$1-')}`,
    ),
  ));

{
  const module = new Module('private/plugins', null);

  try {
    module.paths = Module._nodeModulePaths(process.cwd());
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }

  plugins.require = id => module.require(id);
  plugins.require.resolve = id => module.require.resolve(id);
}

const True = () => true;
const optional = {};
const Optional = () => optional;

Object.setPrototypeOf(
  plugins,
  new Proxy(Object.create(null), {
    get: (target, name) => {
      let value = target[name];

      if (value === undefined) {
        const [, id = '', optional] = /^(.+?)(\?|)$/.exec(name);
        try {
          value = target[name] = plugins(id) || null;
        } catch (exception) {
          value = target[name] = null;
        }
        value = (!value && optional && Optional) || value || undefined;
        optional && value &&
          Reflect.defineProperty(plugins, id, {value, writable: true});

        Reflect.defineProperty(plugins, name, {value, writable: true});
      }

      return value;
    },

    set: (target, name, value) =>
      ('function' === typeof value &&
        Reflect.defineProperty(plugins, name, {value, writable: true})) ||
      true,

    setPrototypeOf: True,
    delete: True,
  }),
);

export default plugins;
// exports = module.exports = plugins;
