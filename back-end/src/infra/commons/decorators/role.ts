import { UserRole } from "@domain/entities/user-role-enum";
import { CustomDecorator, SetMetadata } from "@nestjs/common";

export const Roles = (...args: UserRole[]): CustomDecorator<string> =>
  SetMetadata("roles", args);
