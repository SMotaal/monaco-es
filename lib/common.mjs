/// Builtin

export const { create, freeze, getOwnPropertyDescriptors, setPrototypeOf, defineProperties, defineProperty, values, keys, entries } = Object;

export const { isArray } = Array;

/// Common

export const returns = value => () => value;

export const frozen = object =>
  freeze(create(null, getOwnPropertyDescriptors(object)));

export const empty = frozen({
  [Symbol.iterator]: returns(
    frozen({
      next: returns(frozen({ value: undefined, done: true })),
    }),
  ),
});

export const merge = (...objects) => Object.assign({}, ...objects);
export const map = (iterable, ƒ) => {
  for (const i in (iterable = [...iterable])) iterable[i] = ƒ(iterable[i], i);
  return iterable;
};
export const record = (object, ƒ) => {
  for (const k in (object = merge(object))) object[k] = ƒ(object[k], k);
  return object;
};
export const reduce = (iterable, ƒ, value) => {
  for (const i in (iterable = [...iterable])) value = ƒ(value, iterable[i], i);
  return value;
};

/// Callbacks

function Callbacks(...args) {
  if (new.target) {
    const callbacks = (this.callbacks = freeze([].concat(...args)));
    const name = `Callbacks(${callbacks.length})`;
    return setPrototypeOf(
      {
        [name]: (...args) => Reflect.apply(Callbacks, callbacks, args),
      }[name],
      this,
    );
  } else if (this && this[Symbol.iterator]) {
    let last;
    for (const callback of this) last = Reflect.apply(callback, null, args);
    return last;
  }
}

Callbacks.prototype = Function.prototype;

export const callbacks = (...callbacks) =>
  callbacks.length < 2 ? callbacks[0] : new Callbacks(callbacks);
