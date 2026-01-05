import { FindFileByIdResponse } from "@application/dtos/file/file-by-id";
import {
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3IntegrationHelper } from "@infra/integrations/s3";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class FindFileByIdUseCase {
  constructor(
    private readonly s3: S3Client,
    private readonly s3Helper: S3IntegrationHelper
  ) {}

  private async getHeadObjectCommandOutput(
    key: string
  ): Promise<HeadObjectCommandOutput> {
    try {
      return await this.s3.send(
        new HeadObjectCommand({ Bucket: this.s3Helper.bucket(), Key: key })
      );
    } catch (e) {
      throw new NotFoundException("File not found");
    }
  }

  async execute(key: string, expires = 3000): Promise<FindFileByIdResponse> {
    await this.getHeadObjectCommandOutput(key);

    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket: this.s3Helper.bucket(), Key: key }),
      { expiresIn: expires }
    );

    return { url, expires };
  }
}
