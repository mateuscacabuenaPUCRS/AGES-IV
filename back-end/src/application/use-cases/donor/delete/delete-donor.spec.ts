import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { createMockDonor } from "@test/builders/donor";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { DeleteDonorUseCase } from "./delete-donor";

describe("DeleteDonorUseCase", () => {
  let sut: DeleteDonorUseCase;
  let donorRepository: DonorRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new DeleteDonorUseCase(donorRepository, exceptionService);
  });

  it("should throw an error when not found a donor with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(null);
    jest.spyOn(donorRepository, "delete");

    await sut.execute("example-donor-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });

    expect(donorRepository.delete).not.toHaveBeenCalled();
  });

  it("should delete a donot", async () => {
    const donorMock = createMockDonor();

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findById").mockResolvedValue(donorMock);
    jest.spyOn(donorRepository, "delete");

    await sut.execute(donorMock.id);

    expect(donorRepository.delete).toHaveBeenCalledWith(donorMock.id);

    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });
});
