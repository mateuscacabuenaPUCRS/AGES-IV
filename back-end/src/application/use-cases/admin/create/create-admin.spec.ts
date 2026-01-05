import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { AdminRepository } from "@domain/repositories/admin";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { HashServiceStub } from "@test/stubs/adapters/hash";
import { AdminRepositoryStub } from "@test/stubs/repositories/admin";
import { CreateAdminUseCase } from "./create-admin";
import { createMockAdmin } from "@test/builders/admin";
import { UserRole } from "@domain/entities/user-role-enum";

describe("CreateAdminUseCase", () => {
  let sut: CreateAdminUseCase;
  let adminRepository: AdminRepository;
  let hashService: HashAdapter;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    adminRepository = new AdminRepositoryStub();
    hashService = new HashServiceStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new CreateAdminUseCase(
      adminRepository,
      hashService,
      exceptionService
    );
  });

  it("should throw email already exists error when find admin with this email", async () => {
    const mockAdmin = createMockAdmin();

    const email = "admin-email-duplicate@example.com";

    jest.spyOn(exceptionService, "conflict");
    jest.spyOn(adminRepository, "findByEmail").mockResolvedValue(mockAdmin);

    await sut.execute({
      email,
      fullName: "Test Admin",
      password: "StrongPass@123",
      root: false
    });

    expect(adminRepository.findByEmail).toHaveBeenCalledWith(email);

    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "Email already used"
    });
  });

  it("should create an admin successfully", async () => {
    const hashedPasswordMock = "hashed-password";

    const { email, password, root } = {
      email: "admin@example.com",
      password: "StrongPass@123",
      root: true
    };

    jest.spyOn(adminRepository, "findByEmail").mockResolvedValue(null);
    jest
      .spyOn(hashService, "generateHash")
      .mockResolvedValue(hashedPasswordMock);
    jest.spyOn(adminRepository, "create");

    await sut.execute({
      email,
      fullName: "Test Admin 2",
      password,
      root
    });

    expect(hashService.generateHash).toHaveBeenCalledWith(password);

    expect(adminRepository.create).toHaveBeenCalledWith({
      email,
      fullName: "Test Admin 2",
      password: hashedPasswordMock,
      role: UserRole.ADMIN,
      root
    });
  });

  it("should create an admin with root false by default when not provided", async () => {
    const hashedPasswordMock = "hashed-password";

    const { email, password } = {
      email: "admin@example.com",
      password: "StrongPass@123"
    };

    jest.spyOn(adminRepository, "findByEmail").mockResolvedValue(null);
    jest
      .spyOn(hashService, "generateHash")
      .mockResolvedValue(hashedPasswordMock);
    jest.spyOn(adminRepository, "create");

    await sut.execute({
      email,
      fullName: "Test Admin 3",
      password,
      root: undefined
    });

    expect(adminRepository.create).toHaveBeenCalledWith({
      email,
      fullName: "Test Admin 3",
      password: hashedPasswordMock,
      role: UserRole.ADMIN,
      root: undefined // será tratado pelo Prisma com default false
    });
  });
});
