import { ExceptionsAdapter } from "@domain/adapters/exception";
import { TransactionAdapter } from "@domain/adapters/transaction";
import { CampaignRepository } from "@domain/repositories/campaign";
import { DonationRepository } from "@domain/repositories/donation";
import { DonorRepository } from "@domain/repositories/donor";
import { PaymentRepository } from "@domain/repositories/payment";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { TransactionServiceStub } from "@test/stubs/adapters/transaction";
import { CampaignRepositoryStub } from "@test/stubs/repositories/campaign";
import { DonationRepositoryStub } from "@test/stubs/repositories/donation";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { PaymentRepositoryStub } from "@test/stubs/repositories/payment";
import { CreateDonationUseCase } from "./create-donation";
import { CreateDonationDTO } from "@application/dtos/donation/create";
import { PaymentMethod } from "@domain/entities/payment-method-enum";
import { Periodicity } from "@domain/entities/periodicity-enum";
import { createMockDonor } from "@test/builders/donor";
import { createMockCampaign } from "@test/builders/campaign";
import { createMockDonation } from "@test/builders/donation";
import { PaymentStatus } from "@domain/entities/payment-status-enum";

describe("CreateDonationUseCase", () => {
  let sut: CreateDonationUseCase;
  let donationRepository: DonationRepository;
  let donorRepository: DonorRepository;
  let campaignRepository: CampaignRepository;
  let exceptionService: ExceptionsAdapter;
  let paymentRepository: PaymentRepository;
  let transactionService: TransactionAdapter;

  beforeEach(() => {
    donationRepository = new DonationRepositoryStub();
    donorRepository = new DonorRepositoryStub();
    campaignRepository = new CampaignRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    paymentRepository = new PaymentRepositoryStub();
    transactionService = new TransactionServiceStub();
    sut = new CreateDonationUseCase(
      donationRepository,
      donorRepository,
      campaignRepository,
      exceptionService,
      paymentRepository,
      transactionService
    );
  });

  it("should throw error when donor not found", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(null);

    const input: CreateDonationDTO = {
      amount: 100,
      donorId: "example-donor-id",
      paymentMethod: PaymentMethod.CREDIT_CARD,
      periodicity: Periodicity.MONTHLY,
      campaignId: "example-campaign-id"
    };

    await sut.execute(input);

    expect(donorRepository.findById).toHaveBeenCalledWith(input.donorId);

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });
  });

  it("should throw error when campaign not found", async () => {
    const donorMock = createMockDonor();

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(donorMock);
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(null);

    const input: CreateDonationDTO = {
      amount: 100,
      campaignId: "example-campaign-id",
      donorId: donorMock.id,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      periodicity: Periodicity.MONTHLY
    };

    await sut.execute(input);

    expect(donorRepository.findById).toHaveBeenCalledWith(input.donorId);

    expect(campaignRepository.findById).toHaveBeenCalledWith(input.campaignId);

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Campaign not found"
    });
  });

  it("should create a donation", async () => {
    const TRANSACTION = {};
    const donorMock = createMockDonor();
    const campaignMock = createMockCampaign();
    const donationMock = createMockDonation({
      campaignId: campaignMock.id,
      donorId: donorMock.id
    });

    jest.spyOn(donorRepository, "findById").mockResolvedValue(donorMock);
    jest.spyOn(campaignRepository, "findById").mockResolvedValue(campaignMock);
    jest.spyOn(donationRepository, "create").mockResolvedValue(donationMock);
    jest.spyOn(paymentRepository, "create");

    const input: CreateDonationDTO = {
      amount: 100,
      campaignId: campaignMock.id,
      donorId: donorMock.id,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      periodicity: Periodicity.MONTHLY
    };

    await sut.execute(input);

    expect(donorRepository.findById).toHaveBeenCalledWith(input.donorId);
    expect(campaignRepository.findById).toHaveBeenCalledWith(input.campaignId);
    expect(donationRepository.create).toHaveBeenCalledWith(
      {
        amount: input.amount,
        periodicity: input.periodicity,
        campaignId: input.campaignId,
        donorId: input.donorId
      },
      TRANSACTION
    );
    expect(paymentRepository.create).toHaveBeenCalledWith(
      {
        paymentMethod: input.paymentMethod,
        status: PaymentStatus.CONFIRMED,
        amount: input.amount,
        donationId: donationMock.id,
        paidAt: expect.any(Date)
      },
      TRANSACTION
    );
  });
});
