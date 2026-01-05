import { NewsletterRepository } from "@domain/repositories/newsletter";
import { Workbook } from "exceljs";
import { format } from "date-fns";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ExportExcelUseCase {
  constructor(
    private readonly newsletterRepository: NewsletterRepository,
    private readonly exception: ExceptionsAdapter
  ) {}

  async execute(): Promise<Buffer> {
    try {
      const newsletters = await this.newsletterRepository.findAll();

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Inscrições na newsletter");

      worksheet.columns = [
        { header: "Email", key: "email", width: 50 },
        { header: "Data de cadastro", key: "createdAt", width: 50 }
      ];

      const mappedNewsletters = newsletters.map((newsletter) => ({
        email: newsletter.email,
        createdAt: format(newsletter.createdAt, "dd/MM/yyyy HH:mm")
      }));

      worksheet.addRows(mappedNewsletters);

      worksheet.getRow(1).alignment = { horizontal: "center" };
      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer as unknown as Buffer;
    } catch (error) {
      this.exception.internalServerError({
        message: "Erro ao exportar dados da newsletter"
      });
    }
  }
}
