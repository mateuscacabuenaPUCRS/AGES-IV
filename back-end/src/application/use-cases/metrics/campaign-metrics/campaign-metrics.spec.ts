import { ExceptionsAdapter } from "@domain/adapters/exception";
import { CampaignRepository } from "@domain/repositories/campaign";
import { DonationRepository } from "@domain/repositories/donation";
import { createMockCampaign } from "@test/builders/campaign";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { DonationRepositoryStub } from "@test/stubs/repositories/donation";
import {
  CampaignMetricsUseCase,
  CampaignWithMetrics
} from "./campaign-metrics";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

describe("ComparePaymentMethodsUseCase", () => {
  let sut: CampaignMetricsUseCase;
  let campaignRepository: CampaignRepository;
  let donationRepository: DonationRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    campaignRepository = new CampaignRepositoryStub();
    donationRepository = new DonationRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new CampaignMetricsUseCase(
      campaignRepository,
      donationRepository,
      exceptionService
    );

    jest.spyOn(campaignRepository, "findById");
    jest.spyOn(donationRepository, "findAllByCampaign");
    jest.spyOn(exceptionService, "notFound");
  });

  it("should throw notFound error when campaign does not exist", async () => {
    // Arrange
    const campaignId = "non-existent-id";
    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    // Act
    await sut.execute(campaignId);

    // Assert
    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Campaign not found"
    });
    expect(donationRepository.findAllByCampaign).not.toHaveBeenCalled();
  });

  it("should return empty payment comparison when campaign has no donations", async () => {
    // Arrange
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal(5000),
      currentAmount: new Decimal(0)
    });
    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      []
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert
    expect(campaignRepository.findById).toHaveBeenCalledWith(mockCampaign.id);
    expect(donationRepository.findAllByCampaign).toHaveBeenCalledWith(
      mockCampaign.id
    );
    expect(result).toEqual({
      ...mockCampaign,
      targetAmount: 5000,
      currentAmount: 0,
      paymentComparison: []
    });
  });

  it("should calculate payment metrics correctly with single payment method", async () => {
    // Arrange
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal(10000),
      currentAmount: new Decimal(3000)
    });

    const mockDonations = [
      {
        id: "donation-1",
        amount: 500,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-1",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-1",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(500),
            paidAt: new Date(),
            donationId: "donation-1"
          }
        ]
      },
      {
        id: "donation-2",
        amount: 1000,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-2",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-2",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(1000),
            paidAt: new Date(),
            donationId: "donation-2"
          }
        ]
      }
    ];

    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      mockDonations
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert
    expect(result).toEqual({
      ...mockCampaign,
      targetAmount: 10000,
      currentAmount: 3000,
      paymentComparison: [
        {
          paymentMethod: PaymentMethod.PIX,
          totalAmount: 1500,
          totalCount: 2
        }
      ]
    });
  });

  it("should calculate payment metrics correctly with multiple payment methods", async () => {
    // Arrange
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal(15000),
      currentAmount: new Decimal(5000)
    });

    const mockDonations = [
      {
        id: "donation-1",
        amount: 500,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-1",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-1",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(500),
            paidAt: new Date(),
            donationId: "donation-1"
          }
        ]
      },
      {
        id: "donation-2",
        amount: 1000,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-2",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-2",
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(1000),
            paidAt: new Date(),
            donationId: "donation-2"
          }
        ]
      },
      {
        id: "donation-3",
        amount: 750,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-3",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-3",
            paymentMethod: PaymentMethod.BANK_SLIP,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(750),
            paidAt: new Date(),
            donationId: "donation-3"
          }
        ]
      },
      {
        id: "donation-4",
        amount: 300,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-4",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-4",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(300),
            paidAt: new Date(),
            donationId: "donation-4"
          }
        ]
      }
    ];

    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      mockDonations
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert
    expect(result).toEqual({
      ...mockCampaign,
      targetAmount: 15000,
      currentAmount: 5000,
      paymentComparison: expect.arrayContaining([
        {
          paymentMethod: PaymentMethod.PIX,
          totalAmount: 800,
          totalCount: 2
        },
        {
          paymentMethod: PaymentMethod.CREDIT_CARD,
          totalAmount: 1000,
          totalCount: 1
        },
        {
          paymentMethod: PaymentMethod.BANK_SLIP,
          totalAmount: 750,
          totalCount: 1
        }
      ])
    });
    expect((result as CampaignWithMetrics).paymentComparison).toHaveLength(3);
  });

  it("should filter out non-confirmed payments from metrics calculation", async () => {
    // Arrange
    const mockCampaign = createMockCampaign();

    const mockDonations = [
      {
        id: "donation-1",
        amount: 500,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-1",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-1",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(500),
            paidAt: new Date(),
            donationId: "donation-1"
          },
          {
            id: "payment-2",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.PENDING,
            amount: new Decimal(1000),
            paidAt: null,
            donationId: "donation-1"
          },
          {
            id: "payment-3",
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.FAILED,
            amount: new Decimal(750),
            paidAt: null,
            donationId: "donation-1"
          }
        ]
      }
    ];

    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      mockDonations
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert
    expect((result as CampaignWithMetrics).paymentComparison).toEqual([
      {
        paymentMethod: PaymentMethod.PIX,
        totalAmount: 500,
        totalCount: 1
      }
    ]);
  });

  it("should handle donations with no confirmed payments", async () => {
    // Arrange
    const mockCampaign = createMockCampaign();

    const mockDonations = [
      {
        id: "donation-1",
        amount: 500,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-1",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-1",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.PENDING,
            amount: new Decimal(500),
            paidAt: null,
            donationId: "donation-1"
          }
        ]
      },
      {
        id: "donation-2",
        amount: 300,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-2",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-2",
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.FAILED,
            amount: new Decimal(300),
            paidAt: null,
            donationId: "donation-2"
          }
        ]
      }
    ];

    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      mockDonations
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert
    expect((result as CampaignWithMetrics).paymentComparison).toEqual([]);
  });

  it("should handle repository errors properly", async () => {
    // Arrange
    const campaignId = "campaign-id";
    const repositoryError = new Error("Database connection error");
    (campaignRepository.findById as jest.Mock).mockRejectedValueOnce(
      repositoryError
    );

    // Act & Assert
    await expect(sut.execute(campaignId)).rejects.toThrow(
      "Database connection error"
    );
    expect(campaignRepository.findById).toHaveBeenCalledWith(campaignId);
  });

  it("should convert Decimal amounts to numbers in response", async () => {
    // Arrange
    const mockCampaign = createMockCampaign({
      targetAmount: new Decimal("12345.67"),
      currentAmount: new Decimal("6789.12")
    });

    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      []
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert
    expect((result as CampaignWithMetrics).targetAmount).toBe(12345.67);
    expect((result as CampaignWithMetrics).currentAmount).toBe(6789.12);
    expect(typeof (result as CampaignWithMetrics).targetAmount).toBe("number");
    expect(typeof (result as CampaignWithMetrics).currentAmount).toBe("number");
  });

  it("should handle mixed payment statuses correctly", async () => {
    // Arrange
    const mockCampaign = createMockCampaign();

    const mockDonations = [
      {
        id: "donation-1",
        amount: 500,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-1",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-1",
            paymentMethod: PaymentMethod.PIX,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(500),
            paidAt: new Date(),
            donationId: "donation-1"
          }
        ]
      },
      {
        id: "donation-2",
        amount: 800,
        periodicity: null,
        campaignId: mockCampaign.id,
        donorId: "donor-2",
        createdAt: new Date(),
        payment: [
          {
            id: "payment-2",
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.FAILED,
            amount: new Decimal(300),
            paidAt: null,
            donationId: "donation-2"
          },
          {
            id: "payment-3",
            paymentMethod: PaymentMethod.CREDIT_CARD,
            status: PaymentStatus.CONFIRMED,
            amount: new Decimal(800),
            paidAt: new Date(),
            donationId: "donation-2"
          }
        ]
      }
    ];

    (campaignRepository.findById as jest.Mock).mockResolvedValueOnce(
      mockCampaign
    );
    (donationRepository.findAllByCampaign as jest.Mock).mockResolvedValueOnce(
      mockDonations
    );

    // Act
    const result = await sut.execute(mockCampaign.id);

    // Assert - Only confirmed payments should be included in metrics
    expect((result as CampaignWithMetrics).paymentComparison).toEqual(
      expect.arrayContaining([
        {
          paymentMethod: PaymentMethod.PIX,
          totalAmount: 500,
          totalCount: 1
        },
        {
          paymentMethod: PaymentMethod.CREDIT_CARD,
          totalAmount: 800,
          totalCount: 1
        }
      ])
    );
    expect((result as CampaignWithMetrics).paymentComparison).toHaveLength(2);
  });
});
