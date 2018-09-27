async function CurrentScope(...keys) {
  const globals = ['global', 'self']; // 'this',
  const oneTimeOnly = false;
  const type = 'text/javascript';
  const source = `
    export default (
      [
        $$$
      ].reduce((scope, ƒ, k) => {
        try { scope[k = \`\${ƒ}\`.slice(5)] = ƒ(); }
        catch (exception) { }
        return scope;
      }, new class Scope {})
    );
  `;
  return (CurrentScope = async (...keys) => {
    const code = source.replace(
      '$$$',
      globals
        .concat(...keys)
        .map(k => `ƒ => ${k}`)
        .join(', '),
    );
    try {
      const imports = import(URL.createObjectURL(new Blob([code], {type}), {oneTimeOnly}));
      return (await imports).default;
    } catch (exception) {
      console.error(exception);
    }
  })(...keys);
}

const {log: Log, warn: Warn} = console;

// CurrentScope(['import.meta', 'location', 'document']).then(Log, () => {});

export { CurrentScope, Log, Warn };
//# sourceMappingURL=debugging.js.map
