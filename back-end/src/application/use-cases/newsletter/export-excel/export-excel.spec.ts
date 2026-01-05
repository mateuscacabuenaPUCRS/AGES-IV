import { ExportExcelUseCase } from "./export-excel";
import { NewsletterRepositoryStub } from "@test/stubs/repositories/newsletter";
import { NewsletterRepository } from "@domain/repositories/newsletter";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { createMockNewsletter } from "@test/builders/newsletter";
import { Workbook } from "exceljs";

jest.mock("exceljs");

jest.mock("date-fns", () => ({
  format: jest.fn(() => {
    return "01/01/2024 10:30";
  })
}));

describe("ExportExcelUseCase", () => {
  let repo: NewsletterRepository;
  let exceptions: ExceptionsServiceStub;
  let useCase: ExportExcelUseCase;
  let mockWorkbook: jest.Mocked<Workbook>;
  let mockWorksheet: {
    columns: unknown[];
    addRows: jest.Mock;
    getRow: jest.Mock;
  };
  let mockWriteBuffer: jest.Mock;

  beforeEach(() => {
    repo = new NewsletterRepositoryStub();
    exceptions = new ExceptionsServiceStub();
    useCase = new ExportExcelUseCase(repo, exceptions);

    mockWorksheet = {
      columns: [],
      addRows: jest.fn(),
      getRow: jest.fn(() => ({
        alignment: {},
        font: {}
      }))
    };

    mockWriteBuffer = jest.fn();
    mockWorkbook = {
      addWorksheet: jest.fn(() => mockWorksheet),
      xlsx: {
        writeBuffer: mockWriteBuffer
      }
    } as unknown as jest.Mocked<Workbook>;

    (Workbook as jest.Mock).mockImplementation(() => mockWorkbook);

    jest.spyOn(repo, "findAll");
    jest.spyOn(exceptions, "internalServerError");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("execute", () => {
    it("should export newsletter data to Excel successfully", async () => {
      const mockNewsletters = [
        createMockNewsletter({
          id: "1",
          email: "test1@example.com",
          createdAt: new Date("2024-01-01T10:30:00")
        }),
        createMockNewsletter({
          id: "2",
          email: "test2@example.com",
          createdAt: new Date("2024-01-02T15:45:00")
        })
      ];

      const mockBuffer = Buffer.from("mock excel data");
      (repo.findAll as jest.Mock).mockResolvedValueOnce(mockNewsletters);
      mockWriteBuffer.mockResolvedValueOnce(mockBuffer);

      const result = await useCase.execute();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith(
        "Inscrições na newsletter"
      );
      expect(mockWorksheet.columns).toEqual([
        { header: "Email", key: "email", width: 50 },
        { header: "Data de cadastro", key: "createdAt", width: 50 }
      ]);
      expect(mockWorksheet.addRows).toHaveBeenCalledWith([
        { email: "test1@example.com", createdAt: "01/01/2024 10:30" },
        { email: "test2@example.com", createdAt: "01/01/2024 10:30" }
      ]);
      expect(result).toEqual(mockBuffer);
    });

    it("should handle empty newsletter data gracefully", async () => {
      const mockBuffer = Buffer.from("empty excel data");
      (repo.findAll as jest.Mock).mockResolvedValueOnce([]);
      mockWriteBuffer.mockResolvedValueOnce(mockBuffer);

      const result = await useCase.execute();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith(
        "Inscrições na newsletter"
      );
      expect(mockWorksheet.addRows).toHaveBeenCalledWith([]);
      expect(result).toEqual(mockBuffer);
      expect(exceptions.internalServerError).not.toHaveBeenCalled();
    });

    it("should apply correct styling to header row", async () => {
      const mockNewsletters = [createMockNewsletter()];
      const mockBuffer = Buffer.from("styled excel data");
      const mockHeaderRow = {
        alignment: {},
        font: {}
      };

      (repo.findAll as jest.Mock).mockResolvedValueOnce(mockNewsletters);
      mockWriteBuffer.mockResolvedValueOnce(mockBuffer);
      mockWorksheet.getRow.mockReturnValue(mockHeaderRow);

      await useCase.execute();

      expect(mockWorksheet.getRow).toHaveBeenCalledWith(1);
      expect(mockHeaderRow.alignment).toEqual({ horizontal: "center" });
      expect(mockHeaderRow.font).toEqual({ bold: true });
    });

    it("should handle Excel generation errors and throw internal server error", async () => {
      const mockNewsletters = [createMockNewsletter()];
      const excelError = new Error("Excel generation failed");

      (repo.findAll as jest.Mock).mockResolvedValueOnce(mockNewsletters);
      mockWriteBuffer.mockRejectedValueOnce(excelError);

      await useCase.execute();

      expect(repo.findAll).toHaveBeenCalledTimes(1);
      expect(exceptions.internalServerError).toHaveBeenCalledWith({
        message: "Erro ao exportar dados da newsletter"
      });
    });

    it("should format dates correctly using Brazilian format", async () => {
      const mockDate = new Date("2024-03-15T14:30:00");
      const mockNewsletter = createMockNewsletter({
        email: "test@example.com",
        createdAt: mockDate
      });

      const mockBuffer = Buffer.from("formatted excel data");
      (repo.findAll as jest.Mock).mockResolvedValueOnce([mockNewsletter]);
      mockWriteBuffer.mockResolvedValueOnce(mockBuffer);

      await useCase.execute();

      expect(mockWorksheet.addRows).toHaveBeenCalledWith([
        { email: "test@example.com", createdAt: "01/01/2024 10:30" }
      ]);
    });

    it("should create worksheet with correct name", async () => {
      const mockBuffer = Buffer.from("worksheet test");
      (repo.findAll as jest.Mock).mockResolvedValueOnce([]);
      mockWriteBuffer.mockResolvedValueOnce(mockBuffer);

      await useCase.execute();

      expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith(
        "Inscrições na newsletter"
      );
      expect(mockWorkbook.addWorksheet).toHaveBeenCalledTimes(1);
    });

    it("should map newsletter data correctly", async () => {
      const testEmail = "mapping@test.com";
      const testDate = new Date("2024-05-20T09:15:00");
      const mockNewsletter = createMockNewsletter({
        email: testEmail,
        createdAt: testDate
      });

      const mockBuffer = Buffer.from("mapping test");
      (repo.findAll as jest.Mock).mockResolvedValueOnce([mockNewsletter]);
      mockWriteBuffer.mockResolvedValueOnce(mockBuffer);

      await useCase.execute();

      expect(mockWorksheet.addRows).toHaveBeenCalledWith([
        {
          email: testEmail,
          createdAt: "01/01/2024 10:30"
        }
      ]);
    });
  });
});
