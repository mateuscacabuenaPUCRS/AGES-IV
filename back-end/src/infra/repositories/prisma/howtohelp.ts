import { HowToHelp } from "@domain/entities/howtohelp";
import {
  HowToHelpRepository,
  UpdateHowToHelpParams
} from "@domain/repositories/howtohelp";
import { PrismaService } from "@infra/config/prisma";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaHowToHelpRepository implements HowToHelpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, params: UpdateHowToHelpParams): Promise<void> {
    await this.prisma.howToHelp.update({
      where: { id },
      data: {
        description: params.description,
        updatedAt: new Date()
      }
    });
  }

  async findById(id: string): Promise<HowToHelp | null> {
    return this.prisma.howToHelp.findUnique({
      where: { id }
    });
  }

  async fetchAll(): Promise<HowToHelp[]> {
    return this.prisma.howToHelp.findMany({
      orderBy: { title: "asc" }
    });
  }
}
