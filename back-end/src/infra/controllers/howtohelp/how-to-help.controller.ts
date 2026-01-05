import { FetchAllHowToHelpResponses } from "@application/dtos/howtohelp/fetch-all";
import {
  UpdateHowToHelpDTO,
  UpdateHowToHelpResponses
} from "@application/dtos/howtohelp/update";
import { UpdateHowToHelpUseCase } from "@application/use-cases/howtohelp/update";
import { HowToHelp } from "@domain/entities/howtohelp";
import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("How To Help")
@Controller("how-to-help")
export class HowToHelpController {
  constructor(
    private readonly updateHowToHelpUseCase: UpdateHowToHelpUseCase
  ) {}

  @Patch(":id")
  @UpdateHowToHelpResponses
  async update(
    @Param("id") id: string,
    @Body() body: UpdateHowToHelpDTO
  ): Promise<void> {
    return this.updateHowToHelpUseCase.update(id, body);
  }

  @Get()
  @FetchAllHowToHelpResponses
  async fetchAll(): Promise<HowToHelp[]> {
    return this.updateHowToHelpUseCase.fetchAll();
  }
}
