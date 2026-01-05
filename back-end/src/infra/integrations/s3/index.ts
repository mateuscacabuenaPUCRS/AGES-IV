import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";

@Injectable()
export class S3IntegrationHelper {
  public bucket(): string {
    return process.env.S3_BUCKET!;
  }

  public prefix(): string {
    return process.env.S3_PREFIX ?? "";
  }

  public publicUrl(key: string): string {
    return `${process.env.S3_URL}/${key}`;
  }

  public buildKey(originalName: string): string {
    return `${randomUUID()}${originalName}`;
  }
}
