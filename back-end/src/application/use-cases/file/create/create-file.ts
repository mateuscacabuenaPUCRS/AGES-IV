import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput
} from "@aws-sdk/client-s3";
import {
  CreateFileDTO,
  CreateFileResponse
} from "@application/dtos/file/create";
import { S3IntegrationHelper } from "@infra/integrations/s3";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CreateFileUseCase {
  constructor(
    private readonly s3: S3Client,
    private readonly s3Helper: S3IntegrationHelper
  ) {}

  async execute(file: CreateFileDTO): Promise<CreateFileResponse> {
    const Key = this.s3Helper.buildKey(file.originalname);
    const params: PutObjectCommandInput = {
      Bucket: this.s3Helper.bucket(),
      Key,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    await this.s3.send(new PutObjectCommand(params));

    const url = this.s3Helper.publicUrl(Key);
    return {
      key: Key,
      contentType: file.mimetype || "application/octet-stream",
      size: file.buffer.length,
      url
    };
  }
}
