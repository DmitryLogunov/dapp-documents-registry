export function applyMixins<TFunction extends Function> // eslint-disable-line @typescript-eslint/ban-types
(derivedCtor: TFunction, constructors: any[]): any {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      );
    });
  });

  return derivedCtor;
}