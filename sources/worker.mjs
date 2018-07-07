const [, EXT = '.mjs'] = /[^/]+(\.m?js)/.exec(
  `${(typeof location !== 'undefined' && location) || 'worker.mjs'}`,
);

(async (global, logs = { global }) => {
  Reflect.has(global, 'this') ||
    Reflect.defineProperty(global, 'this', {
      value: global,
      writable: false,
    });

  try {
    const hash = (global.location && global.location.hash) || '';
    const module = decodeURIComponent(hash).replace('#', './');
    const src = `${new URL(module, location)}`;

    logs.source = { hash, module, src };
    logs['global <before>'] = { ...global };
    logs.import = await (logs.import = import(src));
    logs['global <after>'] = { ...global };
    console.log('[%O] %o', global, logs);
  } catch (exception) {
    console.warn('[%O] %o\n\n', global, logs, exception);
  }
})((1, eval)('this'));

(async () => {
  const { CurrentScope, Log } = await import(`./environment${EXT}`);
  Log(async () => [
    '[CurrentScope] %o',
    await CurrentScope(() => ['import.meta', 'location', 'document']),
  ]);
})().catch(console.error);
