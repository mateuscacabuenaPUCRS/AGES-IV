import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { UpdateDonorUseCase } from "./update-donor";
import { HashServiceStub } from "@test/stubs/adapters/hash";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { DonorRepository } from "@domain/repositories/donor";
import { createMockDonor, createMockDonorWithUser } from "@test/builders/donor";

describe("UpdateDonorUseCase", () => {
  let sut: UpdateDonorUseCase;
  let donorRepository: DonorRepository;
  let hashService: HashAdapter;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    hashService = new HashServiceStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new UpdateDonorUseCase(
      donorRepository,
      hashService,
      exceptionService
    );
  });

  it("should throw an error when not found a donor with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findByIdWithUser").mockResolvedValue(null);
    jest.spyOn(donorRepository, "update");

    await sut.execute("example-donor-id", {
      fullName: "John Doe"
    });

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });

    expect(donorRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error when found a donor with that email", async () => {
    const donorWithUserMock = createMockDonorWithUser();
    const donorMock = createMockDonor();

    jest.spyOn(exceptionService, "conflict");
    jest
      .spyOn(donorRepository, "findByIdWithUser")
      .mockResolvedValue(donorWithUserMock);
    jest.spyOn(donorRepository, "findByEmail").mockResolvedValue(donorMock);
    jest.spyOn(donorRepository, "update");

    await sut.execute(donorWithUserMock.id, {
      email: "johndoe@example.com"
    });

    expect(donorRepository.findByEmail).toHaveBeenCalledWith(
      "johndoe@example.com"
    );

    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "Email already used"
    });

    expect(donorRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error when found a donor with that cpf", async () => {
    const donorWithUserMock = createMockDonorWithUser();
    const donorMock = createMockDonor();

    jest.spyOn(exceptionService, "conflict");
    jest
      .spyOn(donorRepository, "findByIdWithUser")
      .mockResolvedValue(donorWithUserMock);
    jest.spyOn(donorRepository, "findByEmail");
    jest.spyOn(donorRepository, "findByCPF").mockResolvedValue(donorMock);
    jest.spyOn(donorRepository, "update");

    await sut.execute(donorWithUserMock.id, {
      cpf: "123.456.789-19"
    });

    expect(donorRepository.findByEmail).not.toHaveBeenCalled();

    expect(donorRepository.findByCPF).toHaveBeenCalledWith("123.456.789-19");

    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "CPF already used"
    });

    expect(donorRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error when birthdate is before than today", async () => {
    const donorWithUserMock = createMockDonorWithUser();

    jest.spyOn(exceptionService, "badRequest");
    jest
      .spyOn(donorRepository, "findByIdWithUser")
      .mockResolvedValue(donorWithUserMock);
    jest.spyOn(donorRepository, "findByEmail");
    jest.spyOn(donorRepository, "findByCPF");
    jest.spyOn(donorRepository, "update");

    await sut.execute(donorWithUserMock.id, {
      birthDate: new Date("2025-12-31")
    });

    expect(donorRepository.findByEmail).not.toHaveBeenCalled();
    expect(donorRepository.findByCPF).not.toHaveBeenCalled();

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Birth date must be before than today"
    });

    expect(donorRepository.update).not.toHaveBeenCalled();
  });

  it("should updated donor with hash password", async () => {
    const donorWithUserMock = createMockDonorWithUser();

    const email = "johndoe@example.com";
    const cpf = "123.456.780-19";
    const birthDate = new Date("2025-01-01");
    const password = "Senha@123";
    const passwordHashed = "hashed-password";

    jest
      .spyOn(donorRepository, "findByIdWithUser")
      .mockResolvedValue(donorWithUserMock);
    jest.spyOn(donorRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(donorRepository, "findByCPF").mockResolvedValue(null);
    jest.spyOn(hashService, "generateHash").mockResolvedValue(passwordHashed);
    jest.spyOn(donorRepository, "update");

    await sut.execute(donorWithUserMock.id, {
      email,
      cpf,
      birthDate,
      password
    });

    expect(donorRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(donorRepository.findByCPF).toHaveBeenCalledWith(cpf);
    expect(hashService.generateHash).toHaveBeenCalledWith(password);

    expect(donorRepository.update).toHaveBeenCalledWith(donorWithUserMock.id, {
      email,
      cpf,
      birthDate,
      password: passwordHashed
    });
  });
});
