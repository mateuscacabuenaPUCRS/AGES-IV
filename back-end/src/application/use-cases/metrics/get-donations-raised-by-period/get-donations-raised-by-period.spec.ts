import { GetDonationsRaisedByPeriodUseCase } from "./get-donations-raised-by-period";
import {
  GetDonationsRaisedByPeriodDTO,
  DonationsRaisedByPeriodResponse
} from "@application/dtos/metrics/get-donations-raised-by-period";
import { MetricsRepository } from "@domain/repositories/metrics";
import { MetricsRepositoryStub } from "@test/stubs/repositories/metrics";
import { BadRequestException } from "@nestjs/common";

describe("GetDonationsRaisedByPeriodUseCase", () => {
  let useCase: GetDonationsRaisedByPeriodUseCase;
  let repository: MetricsRepository;

  beforeEach(() => {
    repository = new MetricsRepositoryStub();
    useCase = new GetDonationsRaisedByPeriodUseCase(repository);
  });

  describe("execute", () => {
    describe("Daily Grouping (≤31 days)", () => {
      it("should return daily data for 1 day period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-01");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result).toEqual({
          rangeDate: {
            startDate,
            endDate
          },
          daily: {
            data: [
              { label: "2025-01-01", amount: 150 },
              { label: "2025-01-02", amount: 220 },
              { label: "2025-01-03", amount: 0 },
              { label: "2025-01-04", amount: 90 }
            ]
          },
          weekly: undefined,
          monthly: undefined
        });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should return daily data for 15 days period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-15");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate,
          endDate
        });
        expect(result.daily).toBeDefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeUndefined();
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should return daily data for exactly 31 days period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-31");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate,
          endDate
        });
        expect(result.daily).toBeDefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeUndefined();
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should handle daily data with zero amounts", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-05");

        const mockResponse: DonationsRaisedByPeriodResponse = {
          rangeDate: { startDate, endDate },
          daily: {
            data: [
              { label: "2025-01-01", amount: 0 },
              { label: "2025-01-02", amount: 0 },
              { label: "2025-01-03", amount: 0 },
              { label: "2025-01-04", amount: 0 },
              { label: "2025-01-05", amount: 0 }
            ]
          }
        };

        jest
          .spyOn(repository, "findDonationsRaisedByPeriod")
          .mockResolvedValue(mockResponse);

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.daily?.data).toHaveLength(5);
        expect(result.daily?.data.every((item) => item.amount === 0)).toBe(
          true
        );
      });
    });

    describe("Weekly Grouping (32-93 days)", () => {
      it("should return weekly data for 32 days period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-02-01");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result).toEqual({
          rangeDate: {
            startDate,
            endDate
          },
          daily: undefined,
          weekly: {
            data: [
              { label: "Semana 1 (01/01 - 07/01)", amount: 1200 },
              { label: "Semana 2 (08/01 - 14/01)", amount: 1800 },
              { label: "Semana 3 (15/01 - 21/01)", amount: 0 },
              { label: "Semana 4 (22/01 - 28/01)", amount: 1900 }
            ]
          },
          monthly: undefined
        });
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should return weekly data for 60 days period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-03-01");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate,
          endDate
        });
        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeDefined();
        expect(result.monthly).toBeUndefined();
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should return weekly data for exactly 93 days period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-04-03");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate,
          endDate
        });
        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeDefined();
        expect(result.monthly).toBeUndefined();
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should handle weekly data with zero amounts", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-02-15");

        const mockResponse: DonationsRaisedByPeriodResponse = {
          rangeDate: { startDate, endDate },
          weekly: {
            data: [
              { label: "Semana 1 (30/12 - 05/01)", amount: 0 },
              { label: "Semana 2 (06/01 - 12/01)", amount: 0 },
              { label: "Semana 3 (13/01 - 19/01)", amount: 0 }
            ]
          }
        };

        jest
          .spyOn(repository, "findDonationsRaisedByPeriod")
          .mockResolvedValue(mockResponse);

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.weekly?.data.every((item) => item.amount === 0)).toBe(
          true
        );
      });
    });

    describe("Monthly Grouping (≥94 days)", () => {
      it("should return monthly data for 94 days period", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-04-04");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result).toEqual({
          rangeDate: {
            startDate,
            endDate
          },
          daily: undefined,
          weekly: undefined,
          monthly: {
            data: [
              { label: "2024 - Janeiro", amount: 0 },
              { label: "2024 - Fevereiro", amount: 0 },
              { label: "2025 - Janeiro", amount: 8500 },
              { label: "2025 - Fevereiro", amount: 7200 }
            ]
          }
        });
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should return monthly data for 1 year period", async () => {
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-12-31");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate,
          endDate
        });
        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeDefined();
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should return monthly data for multiple years period", async () => {
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2025-12-31");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate,
          endDate
        });
        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeDefined();
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should handle monthly data with zero amounts for periods without data", async () => {
        const startDate = new Date("2024-01-01");
        const endDate = new Date("2024-06-30");

        const mockResponse: DonationsRaisedByPeriodResponse = {
          rangeDate: { startDate, endDate },
          monthly: {
            data: [
              { label: "2024 - Janeiro", amount: 0 },
              { label: "2024 - Fevereiro", amount: 0 },
              { label: "2024 - Março", amount: 0 },
              { label: "2024 - Abril", amount: 0 },
              { label: "2024 - Maio", amount: 0 },
              { label: "2024 - Junho", amount: 0 }
            ]
          }
        };

        jest
          .spyOn(repository, "findDonationsRaisedByPeriod")
          .mockResolvedValue(mockResponse);

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.monthly?.data).toHaveLength(6);
        expect(result.monthly?.data.every((item) => item.amount === 0)).toBe(
          true
        );
        expect(
          result.monthly?.data.every((item) => item.label.startsWith("2024"))
        ).toBe(true);
      });
    });

    describe("Date Validation", () => {
      it("should throw BadRequestException when startDate is after endDate", async () => {
        const startDate = new Date("2025-12-31");
        const endDate = new Date("2025-01-01");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        await expect(useCase.execute(dto)).rejects.toThrow(BadRequestException);
        await expect(useCase.execute(dto)).rejects.toThrow(
          "Start date must be before end date"
        );
      });

      it("should handle same start and end dates", async () => {
        const sameDate = new Date("2025-06-15");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate: sameDate,
          endDate: sameDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({
          startDate: sameDate,
          endDate: sameDate
        });
        expect(result.daily).toBeDefined();
        expect(spy).toHaveBeenCalledWith(sameDate, sameDate);
      });

      it("should handle different date objects with same date values", async () => {
        const startDateCopy1 = new Date("2025-01-01T00:00:00.000Z");
        const startDateCopy2 = new Date("2025-01-01T00:00:00.000Z");
        const endDateCopy = new Date("2025-01-15T23:59:59.999Z");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate: startDateCopy1,
          endDate: endDateCopy
        };

        await useCase.execute(dto);

        expect(spy).toHaveBeenCalledWith(startDateCopy1, endDateCopy);
        expect(startDateCopy1.getTime()).toBe(startDateCopy2.getTime());
      });
    });

    describe("Edge Cases", () => {
      it("should handle boundary case exactly at 31 days (daily)", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-31");

        const result = await useCase.execute({ startDate, endDate });

        expect(result.daily).toBeDefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeUndefined();
      });

      it("should handle boundary case exactly at 32 days (weekly)", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-02-01");

        const result = await useCase.execute({ startDate, endDate });

        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeDefined();
        expect(result.monthly).toBeUndefined();
      });

      it("should handle boundary case exactly at 93 days (weekly)", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-04-03");

        const result = await useCase.execute({ startDate, endDate });

        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeDefined();
        expect(result.monthly).toBeUndefined();
      });

      it("should handle boundary case exactly at 94 days (monthly)", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-04-04");

        const result = await useCase.execute({ startDate, endDate });

        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeDefined();
      });

      it("should preserve exact data structure from repository response", async () => {
        const startDate = new Date("2025-03-01");
        const endDate = new Date("2025-03-15");

        const specificResponse: DonationsRaisedByPeriodResponse = {
          rangeDate: { startDate, endDate },
          daily: {
            data: [
              { label: "2025-03-01", amount: 1500.5 },
              { label: "2025-03-02", amount: 0 },
              { label: "2025-03-03", amount: 2300.75 }
            ]
          }
        };

        jest
          .spyOn(repository, "findDonationsRaisedByPeriod")
          .mockResolvedValue(specificResponse);

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result).toBeDefined();
        expect(result.rangeDate).toEqual(specificResponse.rangeDate);
        expect(result.daily).toEqual(specificResponse.daily);
        expect(result.daily?.data[0].amount).toBe(1500.5);
        expect(result.daily?.data[1].amount).toBe(0);
        expect(result.daily?.data[2].amount).toBe(2300.75);
      });

      it("should handle repository returning unexpected structure", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-05");

        const unexpectedResponse = {
          rangeDate: { startDate, endDate },
          daily: undefined,
          weekly: undefined,
          monthly: undefined
        } as DonationsRaisedByPeriodResponse;

        jest
          .spyOn(repository, "findDonationsRaisedByPeriod")
          .mockResolvedValue(unexpectedResponse);

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        const result = await useCase.execute(dto);

        expect(result.rangeDate).toEqual({ startDate, endDate });
        expect(result.daily).toBeUndefined();
        expect(result.weekly).toBeUndefined();
        expect(result.monthly).toBeUndefined();
      });
    });

    describe("Repository Integration", () => {
      it("should call repository with correct parameters", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-31");

        const spy = jest.spyOn(repository, "findDonationsRaisedByPeriod");

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        await useCase.execute(dto);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(startDate, endDate);
      });

      it("should handle repository errors gracefully", async () => {
        const startDate = new Date("2025-01-01");
        const endDate = new Date("2025-01-31");

        jest
          .spyOn(repository, "findDonationsRaisedByPeriod")
          .mockRejectedValue(new Error("Database connection failed"));

        const dto: GetDonationsRaisedByPeriodDTO = {
          startDate,
          endDate
        };

        await expect(useCase.execute(dto)).rejects.toThrow(
          "Database connection failed"
        );
      });
    });
  });
});
