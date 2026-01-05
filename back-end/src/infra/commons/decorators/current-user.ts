import { UserRole } from "@domain/entities/user-role-enum";
import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface UserPayload {
  id: string;
  role: UserRole;
}

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserPayload;
  }
);
