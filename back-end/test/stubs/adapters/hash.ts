import { HashAdapter } from "@domain/adapters/hash";

export class HashServiceStub implements HashAdapter {
  compare(): Promise<boolean> {
    return;
  }
  generateHash(): Promise<string> {
    return;
  }
}
