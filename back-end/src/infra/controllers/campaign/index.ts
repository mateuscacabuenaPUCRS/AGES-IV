import {
  CreateCampaignDto,
  CreateCampaignResponses
} from "@application/dtos/campaign/create";
import { DeleteCampaignResponses } from "@application/dtos/campaign/delete";
import {
  FindAllCampaignsDTO,
  FindAllCampaignsResponse,
  FindAllCampaignsResponses
} from "@application/dtos/campaign/find-all";
import { FindCampaignByDonorIdResponses } from "@application/dtos/campaign/find-by-donorId";
import {
  CampaignDetails,
  FindCampaignByIdResponses
} from "@application/dtos/campaign/find-by-id";
import {
  UpdateCampaignDto,
  UpdateCampaignResponses,
  UpdateCampaignStatusDto,
  UpdateCampaignStatusResponses
} from "@application/dtos/campaign/update";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { CreateCampaignUseCase } from "@application/use-cases/campaign/create/create-campaign";
import { DeleteCampaignUseCase } from "@application/use-cases/campaign/delete/delete-campaign";
import { FindCampaignByDonorIdUseCase } from "@application/use-cases/campaign/find-by-donorId";
import { FindCampaignByIdUseCase } from "@application/use-cases/campaign/find-by-id/find-campaing-by-id";
import { FindIsRootCampaignUseCase } from "@application/use-cases/campaign/find-is-root";
import { SearchCampaignsUseCase } from "@application/use-cases/campaign/search/search-campaigns";
import { UpdateCampaignIsRootUseCase } from "@application/use-cases/campaign/update-is-root";
import {
  UpdateCampaignStatusUseCase,
  UpdateCampaignUseCase
} from "@application/use-cases/campaign/update/update-campaign";
import { PaginatedEntity } from "@domain/constants/pagination";
import { UserRole } from "@domain/entities/user-role-enum";
import { CampaignDonorDetailsResponse } from "@domain/repositories/campaign";
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
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Campaigns")
@Controller("campaigns")
export class CampaignController {
  constructor(
    private readonly createCampaignUseCase: CreateCampaignUseCase,
    private readonly updateCampaignUseCase: UpdateCampaignUseCase,
    private readonly updateCampaignStatusUseCase: UpdateCampaignStatusUseCase,
    private readonly deleteCampaignUseCase: DeleteCampaignUseCase,
    private readonly findCampaignByIdUseCase: FindCampaignByIdUseCase,
    private readonly searchCampaignsUseCase: SearchCampaignsUseCase,
    private readonly findCampaignByDonorIdUseCase: FindCampaignByDonorIdUseCase,
    private readonly findIsRootCampaignUseCase: FindIsRootCampaignUseCase,
    private readonly updateCampaignIsRootUseCase: UpdateCampaignIsRootUseCase
  ) {}

  @Post()
  @RequireToken()
  @CreateCampaignResponses
  async createCampaign(@Body() body: CreateCampaignDto): Promise<void> {
    return await this.createCampaignUseCase.execute(body);
  }

  @Get("is-root")
  async findIsRootCampaign() {
    return await this.findIsRootCampaignUseCase.execute();
  }

  @Get()
  @FindAllCampaignsResponses
  async searchCampaigns(
    @Query() query: FindAllCampaignsDTO
  ): Promise<FindAllCampaignsResponse> {
    return await this.searchCampaignsUseCase.execute(query);
  }

  @Get(":id")
  @FindCampaignByIdResponses
  async findCampaignById(
    @Param("id") id: string
  ): Promise<CampaignDetails | void> {
    return await this.findCampaignByIdUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":id")
  @UpdateCampaignResponses
  async updateCampaign(
    @Param("id") id: string,
    @Body() body: UpdateCampaignDto
  ): Promise<void> {
    return await this.updateCampaignUseCase.execute(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":id/status")
  @RequireToken([UserRole.ADMIN])
  @UpdateCampaignStatusResponses
  async updateCampaignStatus(
    @Param("id") id: string,
    @Body() body: UpdateCampaignStatusDto
  ): Promise<void> {
    return await this.updateCampaignStatusUseCase.execute(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @RequireToken([UserRole.ADMIN])
  @DeleteCampaignResponses
  async deleteCampaign(@Param("id") id: string): Promise<void> {
    return await this.deleteCampaignUseCase.execute(id);
  }

  @Get("donor/all-donations")
  @FindCampaignByDonorIdResponses
  @RequireToken([UserRole.DONOR])
  async findCampaignByDonorId(
    @CurrentUser() user: UserPayload,
    @Query() query: PaginationDTO
  ): Promise<PaginatedEntity<CampaignDonorDetailsResponse>> {
    return await this.findCampaignByDonorIdUseCase.execute(user.id, query);
  }

  @ApiOperation({ summary: "Update campaign to be the root campaign" })
  @Patch(":id/is-root")
  //@RequireToken([UserRole.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateCampaignIsRoot(@Param("id") id: string): Promise<void> {
    return await this.updateCampaignIsRootUseCase.execute(id);
  }
}
