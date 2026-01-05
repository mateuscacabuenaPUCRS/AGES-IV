import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { DonorRepository } from "@domain/repositories/donor";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { HashServiceStub } from "@test/stubs/adapters/hash";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { CreateDonorUseCase } from "./create-donor";
import { createMockDonor } from "@test/builders/donor";
import { Gender } from "@domain/entities/gender-enum";
import { UserRole } from "@domain/entities/user-role-enum";

describe("CreateDonorUseCase", () => {
  let sut: CreateDonorUseCase;
  let donorRepository: DonorRepository;
  let hashService: HashAdapter;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    hashService = new HashServiceStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new CreateDonorUseCase(
      donorRepository,
      hashService,
      exceptionService
    );
  });

  it("should throw email already exists error when find user with this email", async () => {
    const mockDonor = createMockDonor();

    const email = "donor-email-duplicate";

    jest.spyOn(exceptionService, "conflict");
    jest.spyOn(donorRepository, "findByEmail").mockResolvedValue(mockDonor);

    await sut.execute({
      birthDate: new Date("2004-02-20"),
      cpf: "123.456.789-10",
      email,
      fullName: "John Doe",
      gender: "MALE",
      password: "Senha@123",
      phone: "+5551999999999"
    });

    expect(donorRepository.findByEmail).toHaveBeenCalledWith(email);

    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "Email already used"
    });
  });

  it("should throw cpf already exists error when find user with this cpf", async () => {
    const mockDonor = createMockDonor();

    jest.spyOn(exceptionService, "conflict");
    jest.spyOn(donorRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(donorRepository, "findByCPF").mockResolvedValue(mockDonor);

    await sut.execute({
      birthDate: new Date("2004-02-20"),
      cpf: mockDonor.cpf,
      email: "example@email.com",
      fullName: "John Doe",
      gender: "MALE",
      password: "Senha@123",
      phone: "+5551999999999"
    });

    expect(donorRepository.findByCPF).toHaveBeenCalledWith(mockDonor.cpf);

    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "CPF already used"
    });
  });

  it("should throw birth date must before than today error when birth date is before or equal than today", async () => {
    jest.spyOn(exceptionService, "badRequest");
    jest.spyOn(donorRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(donorRepository, "findByCPF").mockResolvedValue(null);

    await sut.execute({
      birthDate: new Date("2026-01-01"),
      cpf: "123.456.789-10",
      email: "example@email.com",
      fullName: "John Doe",
      gender: "MALE",
      password: "Senha@123",
      phone: "+5551999999999"
    });

    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Birth date must be before than today"
    });
  });

  it("should create a donor", async () => {
    const hashedPasswordMock = "hashed-password";

    const { birthDate, cpf, email, fullName, gender, password, phone } = {
      birthDate: new Date("2000-05-04"),
      cpf: "123.456.789-10",
      email: "example@email.com",
      fullName: "John Doe",
      gender: Gender.MALE,
      password: "Senha@123",
      phone: "+5551999999999"
    };

    jest.spyOn(donorRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(donorRepository, "findByCPF").mockResolvedValue(null);
    jest
      .spyOn(hashService, "generateHash")
      .mockResolvedValue(hashedPasswordMock);
    jest.spyOn(donorRepository, "create");

    await sut.execute({
      birthDate,
      cpf,
      email,
      fullName,
      gender,
      password,
      phone
    });

    expect(hashService.generateHash).toHaveBeenCalledWith(password);

    expect(donorRepository.create).toHaveBeenCalledWith({
      email,
      password: hashedPasswordMock,
      role: UserRole.DONOR,
      birthDate,
      cpf,
      fullName,
      gender,
      phone
    });
  });
});
