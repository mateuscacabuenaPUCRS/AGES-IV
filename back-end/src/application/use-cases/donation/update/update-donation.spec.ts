import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonationRepository } from "@domain/repositories/donation";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { DonationRepositoryStub } from "@test/stubs/repositories/donation";
import { UpdateDonationUseCase } from "./update-donation";
import { createMockDonation } from "@test/builders/donation";

describe("UpdateDonationUseCase", () => {
  let sut: UpdateDonationUseCase;
  let donationRepository: DonationRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donationRepository = new DonationRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new UpdateDonationUseCase(donationRepository, exceptionService);
  });

  it("should throw an error when donation is not found", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donationRepository, "findById").mockResolvedValue(null);
    jest.spyOn(donationRepository, "update");

    await sut.execute(
      "example-donation-id",
      {
        amount: 100
      },
      "example-donor-id"
    );

    expect(donationRepository.findById).toHaveBeenCalledWith(
      "example-donation-id"
    );

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donation not found"
    });

    expect(donationRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error when donation is not owned by the donor", async () => {
    const donationMock = createMockDonation({ donorId: "other-donor-id" });

    jest.spyOn(exceptionService, "forbidden");
    jest.spyOn(donationRepository, "findById").mockResolvedValue(donationMock);
    jest.spyOn(donationRepository, "update");

    await sut.execute(
      donationMock.id,
      {
        amount: 100
      },
      "example-donor-id"
    );

    expect(donationRepository.findById).toHaveBeenCalledWith(donationMock.id);

    expect(exceptionService.forbidden).toHaveBeenCalledWith({
      message: "You can only update your own donations"
    });

    expect(donationRepository.update).not.toHaveBeenCalled();
  });

  it("should update a donation", async () => {
    const donationMock = createMockDonation({ donorId: "example-donor-id" });

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(exceptionService, "forbidden");
    jest.spyOn(donationRepository, "findById").mockResolvedValue(donationMock);
    jest.spyOn(donationRepository, "update");

    await sut.execute(
      donationMock.id,
      {
        amount: 100
      },
      "example-donor-id"
    );

    expect(donationRepository.findById).toHaveBeenCalledWith(donationMock.id);
    expect(donationRepository.update).toHaveBeenCalledWith(donationMock.id, {
      amount: 100
    });

    expect(exceptionService.notFound).not.toHaveBeenCalled();
    expect(exceptionService.forbidden).not.toHaveBeenCalled();
  });
});
