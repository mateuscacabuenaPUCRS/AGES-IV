import { HowToHelp } from "@domain/entities/howtohelp";
import { HowToHelp as PrismaHowToHelp } from "@prisma/client";

export class PrismaHowToHelpMapper {
  static toDomain(howToHelp: PrismaHowToHelp): HowToHelp {
    return {
      id: howToHelp.id,
      title: howToHelp.title,
      description: howToHelp.description,
      updatedAt: howToHelp.updatedAt
    };
  }
}
