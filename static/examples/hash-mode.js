/// <reference path="../../types.d.ts" />
import {findContainer, importMonacoModule, dispatch} from './helpers.js';

let currentHash, currentMode;

const sources = {};

const modes = [];
const specialModes = ['css', 'json', 'html', 'ts'];

const imports = {};

const unhash = hash => `${hash || ''}`.replace(/^(?:#?([a-z]+)|.*?)$/, '$1');
const placeholder = mode => `" ««« Start writing your ${mode} code! »»» "`;

{
  fetchSources();
  parseHash(location.hash || '#css');
  addEventListener('hashchange', () => parseHash(location.hash), {
    passive: true,
  });
}

export default async (monaco, container, options) => {
  currentMonaco = monaco;
  populateModes(monaco);
  // await import('../../build/languages/css/css.js');
  return createEditor(monaco, container, options);
};

let currentMonaco;

/** @param { monaco } monaco */
function populateModes(monaco = currentMonaco) {
  const languages = monaco.languages.getLanguages();
  for (const {id, aliases} of languages) {
    if (modes.includes(id)) continue;
    modes.push((modes[id] = id));
    if (aliases) for (const alias of aliases) modes[alias] = id;
  }
}

/** @param { monaco } monaco */
function createEditor(monaco = currentMonaco, container, options = {}) {
  let {language, code} = options;

  container = findContainer(container);

  const editor = monaco.editor.create(container);

  const setMode = async mode => {
    // console.log(modes);
    if (!mode || !(await importMode(mode)))
      return console.warn(`Unknown mode ${mode}`);
    try {
      language = modes[mode];
      monaco.editor.setModelLanguage(editor.getModel(), language);
      // console.log('setMode(%s)', mode);
    } catch (exception) {
      console.warn(`Failed to switch to "${mode}"`, exception);
    }
  };

  addEventListener('modechange', event => {
    setMode(event.detail.current);
    console.log('modechange', event);
  });
  setMode(language || currentMode);
  // {data: {previous, current: mode = currentMode}}

  return editor;
}

async function importMode(mode) {
  if (!mode) return false;
  if (!imports[mode]) {
    let specifier = `languages/${
      specialModes.includes(mode) ? `${mode}/${mode}` : mode
    }.js`;
    // console.log('importMode(%s) => %s', mode, `${specifier}`);
    try {
      const imported = importMonacoModule(specifier);
      imports[mode] = imported.catch(() => (imports[mode] = false));
      const module = await imported;
      // console.log('importMode(%s) => %s => %o', mode, `${specifier}`, module);
      populateModes();
      return (imports[mode] = module);
    } catch (exception) {
      console.warn(
        `Failed to import "${mode}" from "${specifier}"!`,
        exception,
      );
    }
  }
  return await imports[mode]; // .catch(() => {});
}

async function fetchSources() {
  const response = await fetch(new URL('./code.json', import.meta.url));
  const data = await response.json();
  Object.assign(sources, data);
  // console.log('sources', sources);
}

function parseHash(newHash) {
  let newMode = unhash(newHash);
  if (newHash !== currentHash && newMode)
    dispatch('modechange', {
      previous: currentMode,
      current: (currentMode = newMode),
    });
}
