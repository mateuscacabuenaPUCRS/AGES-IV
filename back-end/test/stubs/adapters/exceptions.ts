import { ExceptionsAdapter } from "@domain/adapters/exception";

export class ExceptionsServiceStub implements ExceptionsAdapter {
  badRequest(): void {
    return;
  }
  conflict(): void {
    return;
  }
  internalServerError(): void {
    return;
  }
  forbidden(): void {
    return;
  }
  unauthorized(): void {
    return;
  }
  notFound(): void {
    return;
  }
}
