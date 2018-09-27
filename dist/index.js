var index = async environment => {
  environment = Object.assign(
    ('object' === typeof self &&
      self.self === self &&
      (self.MonacoEnvironment || (self.MonacoEnvironment = {}))) ||
      {},
    environment,
  );

  return import("./monaco.js");
};

export default index;
//# sourceMappingURL=index.js.map
