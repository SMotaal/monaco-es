export const findContainer = (container, parent) => {
  let ownerDocument = parent || (parent = document.body).ownerDocument;

  if (typeof container === 'string')
    container = /\W/.test(container)
      ? parent.querySelector(container)
      : parent.getElementById(container);

  if (!container)
    container = parent.appendChild(ownerDocument.createElement('div'));

  return container;
};

export const importNodeModule = (specifier, base = origin) =>
  import(`${new URL(`./node_modules/${specifier}`, base)}`);

export const importMonacoModule = (specifier, base = origin) =>
  import(`${new URL(`./node_modules/monaco-es/dist/${specifier}`, base)}`);

  // 'node_modules/monaco-es/dist'


export const dispatch = (type, detail) =>
  console.log(`Dispatch %s: %o`, type, detail) ||
  dispatchEvent(new CustomEvent(type, { detail }));
