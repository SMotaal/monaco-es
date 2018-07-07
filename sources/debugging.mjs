export async function CurrentScope(...keys) {
  const globals = ['global', 'self']; // 'this',
  const blob = true;
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
      const imports = import(blob
        ? URL.createObjectURL(new Blob([code], {type}), {oneTimeOnly})
        : `data:${type},${encodeURIComponent(code)}`);
      return (await imports).default;
    } catch (exception) {
      console.error(exception);
    }
  })(...keys);
}

export const {log: Log, warn: Warn} = console;

CurrentScope(['import.meta', 'location', 'document']).then(Log, () => {});
