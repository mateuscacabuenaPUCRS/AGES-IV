import { UserRole } from "@domain/entities/user-role-enum";

export interface TokenPayload {
  id: string;
  role: UserRole;
}

export interface GetPayloadFromTokenOutput {
  id: string;
  role: UserRole;
  exp: number;
}

export abstract class TokenAdapter {
  abstract generateToken(payload: TokenPayload): Promise<string>;
  abstract getPayloadFromToken(
    token: string
  ): Promise<GetPayloadFromTokenOutput>;
}
