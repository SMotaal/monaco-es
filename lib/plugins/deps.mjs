export const deps = ({resolve, dependencies} = {}) => ({
  resolveId:
    !resolve || !dependencies
      ? () => {}
      : (specifier, referrer) => {
          if (
            !(
              specifier.includes('_deps') ||
              (referrer && referrer.includes('_deps'))
            )
          )
            return;

          for (const k in dependencies) {
            if (specifier.includes(k)) {
              const resolved = resolve(dependencies[k]);
              return resolve(dependencies[k]);
            }
          }
        },
});
