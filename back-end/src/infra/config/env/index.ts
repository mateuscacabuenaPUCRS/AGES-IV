import { plainToInstance } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync
} from "class-validator";

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsOptional()
  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  AWS_REGION: string;

  @IsString()
  @IsNotEmpty()
  MAIL_FROM: string;

  @IsString()
  @IsNotEmpty()
  MAIL_REPLY_TO: string;

  @IsString()
  @IsNotEmpty()
  S3_BUCKET: string;

  @IsString()
  @IsNotEmpty()
  S3_URL: string;

  @IsString()
  @IsNotEmpty()
  QUEUE_ATTEMPTS: number;

  @IsString()
  @IsNotEmpty()
  QUEUE_DELAY_BETWEEN_ATTEMPTS: number;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;

  @IsString()
  @IsNotEmpty()
  REDIS_PORT: number;

  @IsOptional()
  @IsString()
  REDIS_PASS?: string;
}

export class EnvConfig {
  static validate(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
      enableImplicitConversion: true
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: true
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  }
}
