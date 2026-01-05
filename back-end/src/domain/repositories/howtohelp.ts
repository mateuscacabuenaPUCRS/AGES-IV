import { HowToHelp } from "@domain/entities/howtohelp";

export interface UpdateHowToHelpParams {
  description: string;
}

export abstract class HowToHelpRepository {
  abstract update(id: string, params: UpdateHowToHelpParams);
  abstract findById(id: string): Promise<HowToHelp | null>;
  abstract fetchAll(): Promise<HowToHelp[]>;
}
