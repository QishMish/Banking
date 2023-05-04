type Builder<T> = {
  [P in keyof T]: (value: T[P]) => Builder<T>;
} & { build: () => T };

export { Builder };
