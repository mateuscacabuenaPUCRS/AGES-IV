import {
  CreateFileDTO,
  CreateFileResponse,
  CreateFileResponses
} from "@application/dtos/file/create";
import {
  DeleteFileResponse,
  DeleteFileResponseDecorator
} from "@application/dtos/file/delete";
import {
  FindFileByIdResponse,
  FindFileByIdResponseDecorator
} from "@application/dtos/file/file-by-id";
import { CreateFileUseCase } from "@application/use-cases/file/create/create-file";
import { DeleteFileUseCase } from "@application/use-cases/file/delete/delete-file";
import { FindFileByIdUseCase } from "@application/use-cases/file/find-by-id/find-file-by-id";
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { ApiTags, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags("Files")
@Controller("files")
export class FileController {
  constructor(
    private readonly createFileUseCase: CreateFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly findFileByIdUseCase: FindFileByIdUseCase
  ) {}

  @Post()
  @CreateFileResponses
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
  async createFile(
    @UploadedFile() file: Express.Multer.File
  ): Promise<CreateFileResponse> {
    const dto: CreateFileDTO = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname
    };
    return await this.createFileUseCase.execute(dto);
  }

  @Get(":id")
  @FindFileByIdResponseDecorator
  async getFileById(@Param("id") id: string): Promise<FindFileByIdResponse> {
    return await this.findFileByIdUseCase.execute(id);
  }

  @Delete(":id")
  @DeleteFileResponseDecorator
  async deleteFile(@Param("id") id: string): Promise<DeleteFileResponse> {
    return await this.deleteFileUseCase.execute(id);
  }
}
