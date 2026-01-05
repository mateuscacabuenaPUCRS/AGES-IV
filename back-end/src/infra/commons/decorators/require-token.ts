import { applyDecorators, UseGuards, Type } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "./role";
import { UserRole } from "@domain/entities/user-role-enum";
import { RoleGuard } from "../guards/role";
import { AuthTokenGuard } from "../guards/token";

export function RequireToken(
  roles: UserRole[] = [],
  guard: Type = AuthTokenGuard
): MethodDecorator {
  const decorators = [ApiBearerAuth("token"), UseGuards(guard)];

  if (roles.length > 0) {
    decorators.push(Roles(...roles), UseGuards(RoleGuard));
  }

  return applyDecorators(...decorators);
}
