import { Gender } from "./gender-enum";

export class Donor {
  id: string;
  birthDate: Date;
  gender: Gender;
  phone: string;
  cpf: string;
}
