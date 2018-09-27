const {log, group, groupEnd} = console;

export const tracer = (...flags) => {
  const traces = flags.join();
  const tracer = { name: 'tracer' };

  const groups = [];
  const popGroup = (id = null) => {
    if (id === null) return;
    else if (typeof id !== 'number') id = groups.indexOf(id);
    else if (id < 0) id = groups.length - id;
    while (id >= 0 && id < groups.length) groups.pop(), groupEnd();
  };
  const pushGroup = (id, ...args) => {
    if (!id) return;
    const index = groups.indexOf(id);
    if (index > -1) {
      popGroup(index + 1);
      args.length && log(...args);
    } else {
      groups.push(id);
      args.length ? group(...args) : group(id);
    }
  };

  if (flags.includes('resolveId')) {
    let index, references, lastReferrer, lastSource;

    tracer.resolveId = (specifier, referrer) => {
      index++;
      if (referrer) {
        if (lastReferrer !== referrer) {
          popGroup(lastReferrer);
          lastReferrer = referrer;
          references = 1;
          pushGroup(referrer, '\n[IN] %o', referrer);
        } else {
          references++;
          pushGroup(referrer);
        }
        log('[FROM] %d %o', references, specifier);
      } else if (specifier && lastSource !== specifier) {
        popGroup(lastSource);
        pushGroup(specifier, '\n[SRC] %o', specifier);
        lastSource = specifier;
        (references = 0), (lastReferrer = undefined);
      }
    };
  }

  return tracer;
};
