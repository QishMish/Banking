type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type FindOptions<T> = {
  [K in keyof T]?: T[K];
};

export { DeepPartial };
