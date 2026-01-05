import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class PaginationDTO {
  @ApiProperty({
    description: "Page number",
    example: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: "Page size",
    example: 10,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}

export class PaginationEntityDTO {
  @ApiProperty({
    description: "Page number",
    example: 1
  })
  page: number;

  @ApiProperty({
    description: "Last page",
    example: 10
  })
  lastPage: number;

  @ApiProperty({
    description: "Total items",
    example: 100
  })
  total: number;
}
