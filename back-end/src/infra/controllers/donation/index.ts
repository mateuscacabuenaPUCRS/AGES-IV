import {
  CreateDonationDTO,
  CreateDonationResponses
} from "@application/dtos/donation/create";
import { DeleteDonationResponses } from "@application/dtos/donation/delete";
import {
  FindAllDonationsResponse,
  FindAllDonationsResponses
} from "@application/dtos/donation/find-all";
import {
  DonationDetails,
  FindDonationByIdResponses
} from "@application/dtos/donation/find-by-id";
import {
  UpdateDonationDTO,
  UpdateDonationResponses
} from "@application/dtos/donation/update";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { CreateDonationUseCase } from "@application/use-cases/donation/create/create-donation";
import { DeleteDonationUseCase } from "@application/use-cases/donation/delete/delete-donation";
import { FindAllDonationsUseCase } from "@application/use-cases/donation/find-all/find-all-donations";
import { FindDonationByIdUseCase } from "@application/use-cases/donation/find-by-id/find-donation-by-id";
import { UpdateDonationUseCase } from "@application/use-cases/donation/update/update-donation";
import { UserRole } from "@domain/entities/user-role-enum";
import {
  CurrentUser,
  UserPayload
} from "@infra/commons/decorators/current-user";
import { RequireToken } from "@infra/commons/decorators/require-token";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Donations")
@Controller("donations")
export class DonationController {
  constructor(
    private readonly createDonationUseCase: CreateDonationUseCase,
    private readonly updateDonationUseCase: UpdateDonationUseCase,
    private readonly deleteDonationUseCase: DeleteDonationUseCase,
    private readonly findDonationByIdUseCase: FindDonationByIdUseCase,
    private readonly findAllDonationsUseCase: FindAllDonationsUseCase
  ) {}

  @Post()
  @CreateDonationResponses
  async createDonation(@Body() body: CreateDonationDTO): Promise<void> {
    return await this.createDonationUseCase.execute(body);
  }

  @Get()
  @FindAllDonationsResponses
  @RequireToken([UserRole.DONOR])
  async findAllDonations(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationDTO
  ): Promise<FindAllDonationsResponse | void> {
    return await this.findAllDonationsUseCase.execute(query, user.id);
  }

  @Get(":id")
  @FindDonationByIdResponses
  @RequireToken([UserRole.DONOR])
  async findDonationById(
    @Param("id") id: string,
    @CurrentUser() user: UserPayload
  ): Promise<DonationDetails | void> {
    return await this.findDonationByIdUseCase.execute(id, user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":id")
  @UpdateDonationResponses
  @RequireToken([UserRole.DONOR])
  async updateDonation(
    @Param("id") id: string,
    @Body() body: UpdateDonationDTO,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    return await this.updateDonationUseCase.execute(id, body, user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @DeleteDonationResponses
  @RequireToken([UserRole.DONOR])
  async deleteDonation(
    @Param("id") id: string,
    @CurrentUser() user: UserPayload
  ): Promise<void> {
    return await this.deleteDonationUseCase.execute(id, user.id);
  }
}
