const [, EXT = '.mjs'] = /[^/]+(\.m?js)/.exec(
  `${(typeof location !== 'undefined' && location) || 'worker.mjs'}`,
);

(async (global, logs = {global}) => {
  Reflect.has(global, 'this') ||
    Reflect.defineProperty(global, 'this', {
      value: global,
      writable: false,
    });

  try {
    const hash = (global.location && global.location.hash) || '';
    const module = decodeURIComponent(hash).replace('#', './');
    const src = `${new URL(module, location)}`;

    logs.source = {hash, module, src};
    logs.import = await (logs.import = import(src));
  } catch (exception) {
    console.warn('[%O] %o\n\n', global, logs, exception);
  }
})((0, eval)('this'));
//# sourceMappingURL=worker.js.map
