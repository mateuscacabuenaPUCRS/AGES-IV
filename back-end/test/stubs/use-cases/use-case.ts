class UseCaseStub {
  execute(): void {
    return;
  }
}

export class UseCaseFactory {
  static execute<T>(): T {
    return new UseCaseStub() as T;
  }
}
