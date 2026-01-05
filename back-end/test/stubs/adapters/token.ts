import {
  GetPayloadFromTokenOutput,
  TokenAdapter
} from "@domain/adapters/token";

export class TokenServiceStub implements TokenAdapter {
  generateToken(): Promise<string> {
    return;
  }
  getPayloadFromToken(): Promise<GetPayloadFromTokenOutput> {
    return;
  }
}
