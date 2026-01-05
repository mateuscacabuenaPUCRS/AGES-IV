import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Header
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  CreateNewsletterDto,
  CreateNewsletterResponse
} from "@application/dtos/newsletter/create";
import { CreateNewsletterUseCase } from "@application/use-cases/newsletter/create/create-newsletter";
import { ExportExcelUseCase } from "@application/use-cases/newsletter/export-excel/export-excel";
import { Response } from "express";
@ApiTags("Newsletter")
@Controller("newsletter")
export class NewsletterController {
  constructor(
    private readonly createNewsletterUseCase: CreateNewsletterUseCase,
    private readonly exportExcelUseCase: ExportExcelUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Newsletter Subscription" })
  @ApiResponse({
    status: 201,
    description: "Subscription successful"
  })
  @ApiResponse({
    status: 409,
    description: "Email already subscribed to the newsletter"
  })
  async subscribe(
    @Body() body: CreateNewsletterDto
  ): Promise<CreateNewsletterResponse> {
    return await this.createNewsletterUseCase.execute(body);
  }

  @Get()
  @ApiOperation({
    summary: "Export newsletter subscriptions to Excel"
  })
  @Header(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  )
  @Header(
    "Content-Disposition",
    'attachment; filename="inscricoes-newsletter.xlsx"'
  )
  async exportSubscriptions(@Res() response: Response): Promise<void> {
    const excelBuffer = await this.exportExcelUseCase.execute();
    response.send(excelBuffer);
  }
}
