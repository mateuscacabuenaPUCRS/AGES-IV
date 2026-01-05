import { UpdateHowToHelpDTO } from "@application/dtos/howtohelp/update";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HowToHelp } from "@domain/entities/howtohelp";
import { HowToHelpRepository } from "@domain/repositories/howtohelp";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UpdateHowToHelpUseCase {
  constructor(
    private readonly howToHelpRepository: HowToHelpRepository,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async update(id: string, params: UpdateHowToHelpDTO): Promise<void> {
    const findHowToHelp = await this.howToHelpRepository.findById(id);

    if (!findHowToHelp) {
      this.exceptionService.notFound({ message: "How to Help not found" });
    }

    await this.howToHelpRepository.update(id, {
      description: params.description
    });
  }

  async fetchAll(): Promise<HowToHelp[]> {
    return this.howToHelpRepository.fetchAll();
  }
}
