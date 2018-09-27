import { createFilter } from 'rollup-pluginutils';

import { reindent, canonical } from './helpers.mjs';

export const css = ({
  include = ['**/*.css'],
  exclude,
  filter = createFilter(include, exclude),
} = {}) => ({
  transform: (source, id) => {
    if (!/\.css([#?].*?|)$/i.test(id)) return;
    let mappings = '';
    const src = canonical(id);
    const code = reindent(`
      const css = ${JSON.stringify(source)};
      export const element = (${importStyles})(css, "${src}");
      export default css;
      //@ sourceURL=${id}
    `);
    return { code, map: { mappings: '' } };
  },
});

const importStyles = (css, src) => {
  if (typeof document !== 'object')
    console.info(`Skipped loading "${src}"`);
  try {
    const id = src
      .replace(/\.css.*$/, '')
      .replace(/[\\:]/g, '/')
      .replace(/[^\w\/]+/g, '');
    return (
      document.querySelector(`style[id="${id}"]`) ||
      document.head.appendChild(
        Object.assign(document.createElement('style'), {
          id,
          textContent: `${css}\n\n /* sourceURL=${src} */`,
        }),
      )
    );
  } catch (exception) {
    console.warn(`Failed load "${src}"`, exception);
  }
};

export default css;
