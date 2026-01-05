import { GetDonationByPaymentMethodAndDateUseCase } from "./get-donation-by-payment-method";
import {
  GetDonationByPaymentMethodAndDateDTO,
  DonationByPaymentMethodAndDateResponse
} from "@application/dtos/metrics/get-donation-by-payment-method";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { PaymentMethod } from "@prisma/client";
import { MetricsRepository } from "@domain/repositories/metrics";
import { MetricsRepositoryStub } from "@test/stubs/repositories/metrics";

describe("GetDonationByPaymentMethodAndDateUseCase", () => {
  let useCase: GetDonationByPaymentMethodAndDateUseCase;
  let repository: MetricsRepository;
  let exceptionService: ExceptionsAdapter;

  const startDate = new Date("2025-01-01");
  const endDate = new Date("2025-12-31");

  beforeEach(() => {
    repository = new MetricsRepositoryStub();
    exceptionService = new ExceptionsServiceStub();

    useCase = new GetDonationByPaymentMethodAndDateUseCase(
      repository,
      exceptionService
    );
  });

  describe("execute", () => {
    it("should return total donation amount by payment method for valid date range", async () => {
      const spy = jest.spyOn(repository, "findByDateDonationByPaymentMethod");

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate,
        endDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: {
          startDate,
          endDate
        },
        data: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 5000,
            totalQuantity: 25
          },
          {
            paymentMethod: PaymentMethod.CREDIT_CARD,
            totalAmount: 10000,
            totalQuantity: 15
          },
          {
            paymentMethod: PaymentMethod.BANK_SLIP,
            totalAmount: 3000,
            totalQuantity: 10
          }
        ]
      });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(startDate, endDate);
    });

    it("should allow start date equal to end date", async () => {
      const sameDate = new Date("2025-06-15");
      const sameDateResponse = {
        rangeDate: {
          startDate: sameDate,
          endDate: sameDate
        },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 1000,
            totalQuantity: 2
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(sameDateResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate: sameDate,
        endDate: sameDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: {
          startDate: sameDate,
          endDate: sameDate
        },
        data: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 1000,
            totalQuantity: 2
          }
        ]
      });
      expect(repository.findByDateDonationByPaymentMethod).toHaveBeenCalledWith(
        sameDate,
        sameDate
      );
    });

    it("should return empty data when no donations found in date range", async () => {
      const emptyResponse = {
        rangeDate: { startDate, endDate },
        totalDonationAmountByPaymentMethodAmount: []
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(emptyResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate,
        endDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: { startDate, endDate },
        data: []
      });
      expect(repository.findByDateDonationByPaymentMethod).toHaveBeenCalledWith(
        startDate,
        endDate
      );
    });

    it("should handle single day date range", async () => {
      const singleDate = new Date("2025-06-15");
      const singleDayResponse = {
        rangeDate: {
          startDate: singleDate,
          endDate: singleDate
        },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 500,
            totalQuantity: 1
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(singleDayResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate: singleDate,
        endDate: singleDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: {
          startDate: singleDate,
          endDate: singleDate
        },
        data: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 500,
            totalQuantity: 1
          }
        ]
      });
      expect(repository.findByDateDonationByPaymentMethod).toHaveBeenCalledWith(
        singleDate,
        singleDate
      );
    });

    it("should handle only PIX payments", async () => {
      const pixOnlyResponse = {
        rangeDate: { startDate, endDate },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 15000,
            totalQuantity: 50
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(pixOnlyResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate,
        endDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: { startDate, endDate },
        data: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 15000,
            totalQuantity: 50
          }
        ]
      });
    });

    it("should handle only CREDIT_CARD payments", async () => {
      const creditCardOnlyResponse = {
        rangeDate: { startDate, endDate },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.CREDIT_CARD,
            totalAmount: 8000,
            totalQuantity: 12
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(creditCardOnlyResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate,
        endDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: { startDate, endDate },
        data: [
          {
            paymentMethod: PaymentMethod.CREDIT_CARD,
            totalAmount: 8000,
            totalQuantity: 12
          }
        ]
      });
    });

    it("should handle only BANK_SLIP payments", async () => {
      const bankSlipOnlyResponse = {
        rangeDate: { startDate, endDate },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.BANK_SLIP,
            totalAmount: 2500,
            totalQuantity: 5
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(bankSlipOnlyResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate,
        endDate
      };

      const result = await useCase.execute(dto);

      expect(result).toEqual({
        rangeDate: { startDate, endDate },
        data: [
          {
            paymentMethod: PaymentMethod.BANK_SLIP,
            totalAmount: 2500,
            totalQuantity: 5
          }
        ]
      });
    });

    it("should handle large date range spanning multiple years", async () => {
      const largeRangeStart = new Date("2021-01-01");
      const largeRangeEnd = new Date("2025-12-31");

      const largeRangeResponse = {
        rangeDate: {
          startDate: largeRangeStart,
          endDate: largeRangeEnd
        },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 100000,
            totalQuantity: 500
          },
          {
            paymentMethod: PaymentMethod.CREDIT_CARD,
            totalAmount: 200000,
            totalQuantity: 300
          },
          {
            paymentMethod: PaymentMethod.BANK_SLIP,
            totalAmount: 50000,
            totalQuantity: 100
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(largeRangeResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate: largeRangeStart,
        endDate: largeRangeEnd
      };

      const result = (await useCase.execute(
        dto
      )) as DonationByPaymentMethodAndDateResponse;

      expect(result).toBeDefined();
      expect(result.rangeDate.startDate).toEqual(largeRangeStart);
      expect(result.rangeDate.endDate).toEqual(largeRangeEnd);
      expect(result.data).toHaveLength(3);
      expect(repository.findByDateDonationByPaymentMethod).toHaveBeenCalledWith(
        largeRangeStart,
        largeRangeEnd
      );
    });

    it("should handle different date objects with same date values", async () => {
      const startDateCopy = new Date("2025-01-01T00:00:00.000Z");
      const endDateCopy = new Date("2025-12-31T23:59:59.999Z");

      const spy = jest.spyOn(repository, "findByDateDonationByPaymentMethod");

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate: startDateCopy,
        endDate: endDateCopy
      };

      await useCase.execute(dto);

      expect(spy).toHaveBeenCalledWith(startDateCopy, endDateCopy);
    });

    it("should preserve exact data structure from repository response", async () => {
      const specificResponse = {
        rangeDate: {
          startDate: new Date("2025-03-01"),
          endDate: new Date("2025-03-31")
        },
        totalDonationAmountByPaymentMethodAmount: [
          {
            paymentMethod: PaymentMethod.PIX,
            totalAmount: 1500.5,
            totalQuantity: 7
          }
        ]
      };

      jest
        .spyOn(repository, "findByDateDonationByPaymentMethod")
        .mockResolvedValue(specificResponse);

      const dto: GetDonationByPaymentMethodAndDateDTO = {
        startDate: new Date("2025-03-01"),
        endDate: new Date("2025-03-31")
      };

      const result = (await useCase.execute(
        dto
      )) as DonationByPaymentMethodAndDateResponse;

      expect(result).toBeDefined();
      expect(result.rangeDate).toEqual(specificResponse.rangeDate);
      expect(result.data).toEqual(
        specificResponse.totalDonationAmountByPaymentMethodAmount
      );
      expect(result.data[0].totalAmount).toBe(1500.5);
      expect(result.data[0].totalQuantity).toBe(7);
      expect(result.data[0].paymentMethod).toBe(PaymentMethod.PIX);
    });
  });
});
