import type { RoleEnum } from "@/contexts/UserContext";
import type { Gender } from "@/contexts/UserContext";

export interface JWTTokenPayload {
  id: string;
  fullname: string;
  email: string;
  birthDate?: Date;
  gender?: Gender;
  phone?: string;
  cpf?: string;
  root?: boolean;
  role: RoleEnum;
  accessToken: string;
  exp: number;
  iat: number;
}
