import { Module } from "@nestjs/common";
import { DatabaseModule } from "@infra/modules/database";
import { ExceptionModule } from "@infra/modules/exception";
import { NewsController } from "@infra/controllers/news";
import { CreateNewsUseCase } from "@application/use-cases/news/create/create-news";
import { FindAllNewsUseCase } from "@application/use-cases/news/find-all/find-all-news";
import { FindNewsByIdUseCase } from "@application/use-cases/news/find-by-id/find-news-by-id";
import { UpdateNewsUseCase } from "@application/use-cases/news/update/update-news";
import { DeleteNewsUseCase } from "@application/use-cases/news/delete/delete-news";

@Module({
  imports: [DatabaseModule, ExceptionModule],
  controllers: [NewsController],
  providers: [
    CreateNewsUseCase,
    FindAllNewsUseCase,
    FindNewsByIdUseCase,
    UpdateNewsUseCase,
    DeleteNewsUseCase
  ]
})
export class NewsModule {}
