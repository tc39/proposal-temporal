export function MakeIntrinsicClass(cls) {
  for (let prop of Object.getOwnPropertyNames(cls)) {
    const desc = Object.getOwnPropertyDescriptor(cls, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    Object.defineProperty(cls, prop, desc);
  }
  for (let prop of Object.getOwnPropertyNames(cls.prototype)) {
    const desc = Object.getOwnPropertyDescriptor(cls.prototype, prop);
    if (!desc.configurable || !desc.enumerable) continue;
    desc.enumerable = false;
    Object.defineProperty(cls.prototype, prop, desc);
  }
}
