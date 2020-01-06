export function MakeIntrinsicClass(Class, name) {
  if ('undefined' !== typeof Symbol) {
    Object.defineProperty(Class.prototype, Symbol.toStringTag, {
      value: name,
      writable: false,
      enumerable: false,
      configurable: true,
    });
    const species = function() { return this };
    Object.defineProperty(species, "name", {
      value: "get [Symbol.species]",
      writable: false,
      enumerable: false,
      configurable: true,
    });
    Object.defineProperty(Class.prototype, Symbol.class, {
      get: species,
      enumerable: false,
      configurable: true,
    });
  }
  for (let prop of Object.getOwnPropertyNames(Class)) {
    const desc = Object.getOwnPropertyDescriptor(Class, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    Object.defineProperty(Class, prop, desc);
  }
  for (let prop of Object.getOwnPropertyNames(Class.prototype)) {
    const desc = Object.getOwnPropertyDescriptor(Class.prototype, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    Object.defineProperty(Class.prototype, prop, desc);
  }
}
