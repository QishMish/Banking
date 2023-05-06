import { Builder } from "../types";

function builder<T>(template: T): Builder<T> {
  const proxy = new Proxy(
    {},
    {
      get(target, propKey) {
        if (propKey === "build") {
          return () => Object.assign({}, template);
        }
        return (value: any = undefined) => {
          template[propKey] = value;
          return proxy;
        };
      },
    }
  );

  return proxy as Builder<T>;
}

export { builder };
