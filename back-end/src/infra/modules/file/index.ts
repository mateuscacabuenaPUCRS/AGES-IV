import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { S3Client } from "@aws-sdk/client-s3";
import { memoryStorage } from "multer";
import { S3IntegrationHelper } from "@infra/integrations/s3";
import { CreateFileUseCase } from "@application/use-cases/file/create/create-file";
import { DeleteFileUseCase } from "@application/use-cases/file/delete/delete-file";
import { FindFileByIdUseCase } from "@application/use-cases/file/find-by-id/find-file-by-id";
import { FileController } from "@infra/controllers/file";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 25 * 1024 * 1024 }
    })
  ],
  controllers: [FileController],
  providers: [
    {
      provide: S3Client,
      useFactory: (cfg: ConfigService) =>
        new S3Client({ region: cfg.get("AWS_REGION") ?? "us-east-2" }),
      inject: [ConfigService]
    },
    S3IntegrationHelper,
    CreateFileUseCase,
    DeleteFileUseCase,
    FindFileByIdUseCase
  ],
  exports: [CreateFileUseCase, DeleteFileUseCase, S3IntegrationHelper, S3Client]
})
export class FileModule {}
