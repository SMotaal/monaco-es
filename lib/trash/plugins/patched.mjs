import {merge, isArray} from '../common.mjs';
import plugins from './plugins.mjs';

const { warn } = console;

const notice = (patch, ...args) => {
  warn(
    `\n\n[PATCH] %s ${(args.length &&
      `in %o${(args.length > 1 && '\n') || ''}`) ||
    ''}`,
    patch,
    ...args,
    '\n',
  );
};

export const patched = {
  commonjs: (...args) => {
    const plugin = plugins.commonjs(...args);
    if (patched.commonjs.disabled) return plugin;
    const ƒ = plugin.options;
    plugin.options = options => {
      const input = options && options.input;
      if (typeof input !== 'object' && isArray(input)) return ƒ(options);
      try {
        const result = ƒ(options);
        plugin.options = ƒ;
        patched.commonjs.disabled = 'ignored';
        return result;
      } catch (exception) {
        notice(
          'named entry points',
          'rollup-plugin-commonjs',
          ...` >> ${exception}`.split('\n', 1),
        );
        return ƒ(merge(options, { input: Object.values(input) }));
      }
    };
    return plugin;
  },
};

export default patched;
