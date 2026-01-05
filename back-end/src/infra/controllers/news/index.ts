import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import {
  CreateNewsDto,
  CreateNewsResponses
} from "@application/dtos/news/create";
import {
  UpdateNewsDto,
  UpdateNewsResponses
} from "@application/dtos/news/update";
import {
  FindAllNewsDto,
  FindAllNewsResponses
} from "@application/dtos/news/find-all";

import { CreateNewsUseCase } from "@application/use-cases/news/create/create-news";
import { FindAllNewsUseCase } from "@application/use-cases/news/find-all/find-all-news";
import { FindNewsByIdUseCase } from "@application/use-cases/news/find-by-id/find-news-by-id";
import { UpdateNewsUseCase } from "@application/use-cases/news/update/update-news";
import { DeleteNewsUseCase } from "@application/use-cases/news/delete/delete-news";
import { News } from "@domain/entities/news";
import { FindNewsByIdResponses } from "@application/dtos/news/find-by-id";
import { DeleteNewsResponses } from "@application/dtos/news/delete";
import { PaginationDTO } from "@application/dtos/utils/pagination";

@ApiTags("News")
@Controller("news")
export class NewsController {
  constructor(
    private readonly createNewsUseCase: CreateNewsUseCase,
    private readonly findAllNewsUseCase: FindAllNewsUseCase,
    private readonly findNewsByIdUseCase: FindNewsByIdUseCase,
    private readonly updateNewsUseCase: UpdateNewsUseCase,
    private readonly deleteNewsUseCase: DeleteNewsUseCase
  ) {}

  @Post()
  @CreateNewsResponses
  async create(@Body() dto: CreateNewsDto): Promise<void> {
    return await this.createNewsUseCase.execute(dto);
  }

  @Get()
  @FindAllNewsResponses
  async list(@Query() query: PaginationDTO): Promise<FindAllNewsDto> {
    return await this.findAllNewsUseCase.execute(query);
  }

  @Get(":id")
  @FindNewsByIdResponses
  async get(@Param("id") id: string): Promise<News> {
    return await this.findNewsByIdUseCase.execute(id);
  }

  @Patch(":id")
  @UpdateNewsResponses
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateNewsDto
  ): Promise<void> {
    return await this.updateNewsUseCase.execute(id, dto);
  }

  @Delete(":id")
  @DeleteNewsResponses
  async remove(@Param("id") id: string): Promise<void> {
    return await this.deleteNewsUseCase.execute(id);
  }
}
