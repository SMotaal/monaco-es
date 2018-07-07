export default async name => {
  const namespace = await import(`./${name}.js`);
  return namespace.default || namespace;
};
