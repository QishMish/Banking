interface SeederRepository {
  bulkCreate<T>(data: T[]): Promise<T[]>;
}

export { SeederRepository };
