import { DonationRepository } from "@domain/repositories/donation";
import { FindAllDonationsUseCase } from "./find-all-donations";
import { DonationRepositoryStub } from "../../../../../test/stubs/repositories/donation";
import { DonorRepository } from "@domain/repositories/donor";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { createMockDonor } from "@test/builders/donor";

describe("FindAllDonationsUseCase", () => {
  let sut: FindAllDonationsUseCase;
  let donationRepository: DonationRepository;
  let donorRepository: DonorRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donationRepository = new DonationRepositoryStub();
    donorRepository = new DonorRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new FindAllDonationsUseCase(
      donationRepository,
      donorRepository,
      exceptionService
    );
  });

  it("should throw an error when donor is not found", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(null);
    jest.spyOn(donationRepository, "findAllByDonor");

    await sut.execute(
      {
        page: 1,
        pageSize: 10
      },
      "example-donor-id"
    );

    expect(donorRepository.findById).toHaveBeenCalledWith("example-donor-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });

    expect(donationRepository.findAllByDonor).not.toHaveBeenCalled();
  });

  it("should return all donations paginated for the donor", async () => {
    const mockDonor = createMockDonor();

    const page = 1;
    const pageSize = 10;

    jest.spyOn(donationRepository, "findAllByDonor");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(mockDonor);

    await sut.execute(
      {
        page,
        pageSize
      },
      mockDonor.id
    );

    expect(donationRepository.findAllByDonor).toHaveBeenCalledWith(
      {
        page,
        pageSize
      },
      mockDonor.id
    );
  });
});
