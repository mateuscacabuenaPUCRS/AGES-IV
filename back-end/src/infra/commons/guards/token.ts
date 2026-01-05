import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { Request } from "express";
import { TokenAdapter } from "@domain/adapters/token";
import { TokenExpiredError } from "@nestjs/jwt";
import { UserPayload } from "../decorators/current-user";

export interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenAdapter) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.tokenService.getPayloadFromToken(token);
      request.user = payload;
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: "Token expired"
        });
      }

      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
