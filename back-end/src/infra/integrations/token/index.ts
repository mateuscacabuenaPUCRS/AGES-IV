import {
  GetPayloadFromTokenOutput,
  TokenAdapter,
  TokenPayload
} from "@domain/adapters/token";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenIntegration implements TokenAdapter {
  constructor(private readonly jwtService: JwtService) {}

  async getPayloadFromToken(token: string): Promise<GetPayloadFromTokenOutput> {
    try {
      const payload =
        await this.jwtService.verifyAsync<GetPayloadFromTokenOutput>(token, {
          secret: process.env.JWT_SECRET
        });

      return payload;
    } catch (error) {
      throw error;
    }
  }

  async generateToken(payload: TokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      issuer: "api-pao-dos-pobres",
      secret: process.env.JWT_SECRET,
      expiresIn: "24h"
    });
  }
}
