import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonationRepository } from "@domain/repositories/donation";
import { FindDonationByIdUseCase } from "./find-donation-by-id";
import { DonationRepositoryStub } from "@test/stubs/repositories/donation";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";

describe("FindDonationByIdUseCase", () => {
  let sut: FindDonationByIdUseCase;
  let donationRepository: DonationRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donationRepository = {
      findById: jest.fn(),
      findAllByDonor: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAllByCampaign: jest.fn()
    } as DonationRepositoryStub;

    exceptionService = {
      notFound: jest.fn(),
      forbidden: jest.fn(),
      badRequest: jest.fn(),
      conflict: jest.fn(),
      internalServerError: jest.fn(),
      unauthorized: jest.fn()
    } as ExceptionsServiceStub;

    sut = new FindDonationByIdUseCase(donationRepository, exceptionService);
  });

  it("should throw an error when donation is not found", async () => {
    (donationRepository.findById as jest.Mock).mockResolvedValue(null);

    await sut.execute("donation-id", "donor-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donation not found"
    });
  });

  it("should throw forbidden error when donation does not belong to donor", async () => {
    (donationRepository.findById as jest.Mock).mockResolvedValue({
      id: "donation-id",
      donorId: "other-donor-id"
    });

    await sut.execute("donation-id", "donor-id");

    expect(exceptionService.forbidden).toHaveBeenCalledWith({
      message: "You can only view your own donations"
    });
  });

  it("should throw forbidden error when donorId is not provided", async () => {
    (donationRepository.findById as jest.Mock).mockResolvedValue({
      id: "donation-id",
      donorId: "donor-id"
    });

    await sut.execute("donation-id", undefined);

    expect(exceptionService.forbidden).toHaveBeenCalledWith({
      message: "You can only view your own donations"
    });
  });

  it("should return donation details when found and belongs to donor", async () => {
    const mockDonation = {
      id: "donation-id",
      amount: 100,
      periodicity: "monthly",
      campaignId: "campaign-123",
      donorId: "donor-id",
      createdAt: new Date("2023-01-01")
    };

    (donationRepository.findById as jest.Mock).mockResolvedValue(mockDonation);

    const result = await sut.execute("donation-id", "donor-id");

    expect(result).toEqual({
      id: mockDonation.id,
      amount: mockDonation.amount,
      periodicity: mockDonation.periodicity,
      campaignId: mockDonation.campaignId,
      donorId: mockDonation.donorId,
      createdAt: mockDonation.createdAt
    });
    expect(exceptionService.notFound).not.toHaveBeenCalled();
    expect(exceptionService.forbidden).not.toHaveBeenCalled();
  });
});
