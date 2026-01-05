import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { FindDonorInformationsUseCase } from ".";
import { createMockDonor } from "@test/builders/donor";

describe("FindDonorInformationsUseCase", () => {
  let sut: FindDonorInformationsUseCase;
  let donorRepository: DonorRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new FindDonorInformationsUseCase(donorRepository, exceptionService);
  });

  it("should throw an error when not found a donor with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(null);

    await sut.execute("example-donor-id");

    expect(donorRepository.findById).toHaveBeenCalledWith("example-donor-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });
  });

  it("should return donor informations", async () => {
    const mockDonor = createMockDonor();

    const mockDonorInformations = {
      id: mockDonor.id,
      campaignsTitles: ["Campaign 1", "Campaign 2", "Campaign 3"],
      createdAt: new Date()
    };

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(mockDonor);
    jest
      .spyOn(donorRepository, "findInformationsById")
      .mockResolvedValue(mockDonorInformations);

    const result = await sut.execute("example-donor-id");

    expect(donorRepository.findById).toHaveBeenCalledWith("example-donor-id");

    expect(donorRepository.findInformationsById).toHaveBeenCalledWith(
      "example-donor-id"
    );

    expect(result).toEqual(mockDonorInformations);

    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });
});
