import { ExceptionParams, ExceptionsAdapter } from "@domain/adapters/exception";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";

@Injectable()
export class ExceptionIntegration implements ExceptionsAdapter {
  badRequest(data: ExceptionParams): void {
    throw new BadRequestException(data);
  }

  conflict(data: ExceptionParams): void {
    throw new ConflictException(data);
  }

  internalServerError(data?: ExceptionParams): void {
    throw new InternalServerErrorException(data);
  }

  forbidden(data?: ExceptionParams): void {
    throw new ForbiddenException(data);
  }

  unauthorized(data?: ExceptionParams): void {
    throw new UnauthorizedException(data);
  }

  notFound(data?: ExceptionParams): void {
    throw new NotFoundException(data);
  }
}
