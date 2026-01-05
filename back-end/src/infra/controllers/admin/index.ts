import {
  CreateAdminDto,
  CreateAdminResponses
} from "@application/dtos/admin/create";
import { DeleteAdminResponses } from "@application/dtos/admin/delete";
import {
  FindAllAdminsResponse,
  FindAllAdminsResponses
} from "@application/dtos/admin/find-all";
import {
  AdminDetails,
  FindAdminByIdResponses
} from "@application/dtos/admin/find-by-id";
import {
  UpdateAdminDto,
  UpdateAdminResponses
} from "@application/dtos/admin/update";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { CreateAdminUseCase } from "@application/use-cases/admin/create/create-admin";
import { DeleteAdminUseCase } from "@application/use-cases/admin/delete/delete-admin";
import { FindAllAdminsUseCase } from "@application/use-cases/admin/find-all/find-all-admins";
import { FindAdminByIdUseCase } from "@application/use-cases/admin/find-by-id/find-admin-by-id";
import { UpdateAdminUseCase } from "@application/use-cases/admin/update/update-admin";
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
  Query,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { RequireToken } from "@infra/commons/decorators/require-token";
import {
  CurrentUser,
  UserPayload
} from "@infra/commons/decorators/current-user";
import { UserRole } from "@domain/entities/user-role-enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateFileDTO } from "@application/dtos/file/create";
import { UpdateAdminAvatarUseCase } from "@application/use-cases/admin/update-avatar/update-avatar";

@ApiTags("Admin")
@Controller("admin")
export class AdminController {
  constructor(
    private readonly createAdminUseCase: CreateAdminUseCase,
    private readonly updateAdminUseCase: UpdateAdminUseCase,
    private readonly updateAdminAvatarUseCase: UpdateAdminAvatarUseCase,
    private readonly deleteAdminUseCase: DeleteAdminUseCase,
    private readonly findAdminByIdUseCase: FindAdminByIdUseCase,
    private readonly findAllAdminsUseCase: FindAllAdminsUseCase
  ) {}

  @Post()
  @RequireToken([UserRole.ADMIN])
  @CreateAdminResponses
  async createAdmin(@Body() body: CreateAdminDto): Promise<void> {
    return await this.createAdminUseCase.execute(body);
  }

  @Get()
  @RequireToken([UserRole.ADMIN])
  @FindAllAdminsResponses
  async findAllAdmins(
    @Query() query: PaginationDTO
  ): Promise<FindAllAdminsResponse> {
    return await this.findAllAdminsUseCase.execute(query);
  }

  @Get(":id")
  @RequireToken([UserRole.ADMIN])
  @FindAdminByIdResponses
  async findAdminById(@Param("id") id: string): Promise<AdminDetails | void> {
    return await this.findAdminByIdUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":id")
  @RequireToken([UserRole.ADMIN])
  @UpdateAdminResponses
  async updateAdmin(
    @Param("id") id: string,
    @Body() body: UpdateAdminDto
  ): Promise<void> {
    return await this.updateAdminUseCase.execute(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":id/avatar")
  @RequireToken([UserRole.ADMIN])
  @UpdateAdminResponses
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary"
        }
      }
    }
  })
  async updateAdminAvatar(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    const body: CreateFileDTO = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname
    };
    return await this.updateAdminAvatarUseCase.execute(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @RequireToken([UserRole.ADMIN])
  @DeleteAdminResponses
  async deleteAdmin(
    @Param("id") id: string,
    @CurrentUser() currentUser: UserPayload
  ): Promise<void> {
    return await this.deleteAdminUseCase.execute({
      adminId: id,
      currentUserId: currentUser.id
    });
  }
}
