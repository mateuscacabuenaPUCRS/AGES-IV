import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { FindDonorByIdUseCase } from "./find-donor-by-id";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { createMockDonorWithUser } from "@test/builders/donor";

describe("FindDonorByIdUseCase", () => {
  let sut: FindDonorByIdUseCase;
  let donorRepository: DonorRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new FindDonorByIdUseCase(donorRepository, exceptionService);
  });

  it("should throw an error when not found a donor with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findByIdWithUser").mockResolvedValue(null);

    await sut.execute("example-donor-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });
  });

  it("should return donor details", async () => {
    const mockDonorWithUser = createMockDonorWithUser();

    jest.spyOn(exceptionService, "notFound");
    jest
      .spyOn(donorRepository, "findByIdWithUser")
      .mockResolvedValue(mockDonorWithUser);
    jest
      .spyOn(donorRepository, "totalAmountDonatedByDonorId")
      .mockResolvedValue(0);

    const result = await sut.execute("example-donor-id");

    expect(result).toEqual({
      id: mockDonorWithUser.id,
      email: mockDonorWithUser.email,
      cpf: mockDonorWithUser.cpf,
      birthDate: mockDonorWithUser.birthDate,
      fullName: mockDonorWithUser.fullName,
      gender: mockDonorWithUser.gender,
      phone: mockDonorWithUser.phone,
      imageUrl: mockDonorWithUser.imageUrl ?? null,
      createdAt: mockDonorWithUser.createdAt,
      totalDonated: 0
    });

    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });
});
