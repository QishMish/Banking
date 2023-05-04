interface DbTransactionServiceInterface {
  executeTransaction<T>(callback: (manager) => Promise<T>): Promise<T>;
}

export { DbTransactionServiceInterface };
