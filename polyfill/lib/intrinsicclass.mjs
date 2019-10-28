export function MakeIntrinsicClass(Class, name) {
  if ('undefined' !== typeof Symbol) {
    Class.prototype[Symbol.toStringTag] = name;
    Class.prototype[Symbol.species] = Class;
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
