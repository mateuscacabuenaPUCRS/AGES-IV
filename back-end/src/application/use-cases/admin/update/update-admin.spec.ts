import { AdminRepositoryStub } from "@test/stubs/repositories/admin";
import { UpdateAdminUseCase } from "./update-admin";
import { HashServiceStub } from "@test/stubs/adapters/hash";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { AdminRepository } from "@domain/repositories/admin";
import { createMockAdmin, createMockAdminWithUser } from "@test/builders/admin";

describe("UpdateAdminUseCase", () => {
  let sut: UpdateAdminUseCase;
  let adminRepository: AdminRepository;
  let hashService: HashAdapter;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    adminRepository = new AdminRepositoryStub();
    hashService = new HashServiceStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new UpdateAdminUseCase(
      adminRepository,
      hashService,
      exceptionService
    );
  });

  it("should throw an error when not found an admin with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(adminRepository, "findByIdWithUser").mockResolvedValue(null);
    jest.spyOn(adminRepository, "update");

    await sut.execute("example-admin-id", {
      root: true
    });

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Admin not found"
    });

    expect(adminRepository.update).not.toHaveBeenCalled();
  });

  it("should throw an error when found an admin with that email", async () => {
    const adminWithUserMock = createMockAdminWithUser();
    const adminMock = createMockAdmin();

    jest.spyOn(exceptionService, "conflict");
    jest
      .spyOn(adminRepository, "findByIdWithUser")
      .mockResolvedValue(adminWithUserMock);
    jest.spyOn(adminRepository, "findByEmail").mockResolvedValue(adminMock);
    jest.spyOn(adminRepository, "update");

    await sut.execute(adminWithUserMock.id, {
      email: "admin@example.com"
    });

    expect(adminRepository.findByEmail).toHaveBeenCalledWith(
      "admin@example.com"
    );

    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "Email already used"
    });

    expect(adminRepository.update).not.toHaveBeenCalled();
  });

  it("should update admin with hash password", async () => {
    const adminWithUserMock = createMockAdminWithUser();

    const email = "admin@example.com";
    const password = "StrongPass@123";
    const root = true;
    const passwordHashed = "hashed-password";

    jest
      .spyOn(adminRepository, "findByIdWithUser")
      .mockResolvedValue(adminWithUserMock);
    jest.spyOn(adminRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(hashService, "generateHash").mockResolvedValue(passwordHashed);
    jest.spyOn(adminRepository, "update");

    await sut.execute(adminWithUserMock.id, {
      email,
      password,
      root
    });

    expect(adminRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(hashService.generateHash).toHaveBeenCalledWith(password);

    expect(adminRepository.update).toHaveBeenCalledWith(adminWithUserMock.id, {
      email,
      password: passwordHashed,
      root
    });
  });

  it("should update admin without changing password", async () => {
    const adminWithUserMock = createMockAdminWithUser();

    const email = "admin@example.com";
    const root = false;

    jest
      .spyOn(adminRepository, "findByIdWithUser")
      .mockResolvedValue(adminWithUserMock);
    jest.spyOn(adminRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(hashService, "generateHash");
    jest.spyOn(adminRepository, "update");

    await sut.execute(adminWithUserMock.id, {
      email,
      root
    });

    expect(adminRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(hashService.generateHash).not.toHaveBeenCalled();

    expect(adminRepository.update).toHaveBeenCalledWith(adminWithUserMock.id, {
      email,
      password: adminWithUserMock.password,
      root
    });
  });

  it("should update admin with same email without validation", async () => {
    const adminWithUserMock = createMockAdminWithUser({
      email: "current@example.com"
    });

    jest
      .spyOn(adminRepository, "findByIdWithUser")
      .mockResolvedValue(adminWithUserMock);
    jest.spyOn(adminRepository, "findByEmail");
    jest.spyOn(adminRepository, "update");

    await sut.execute(adminWithUserMock.id, {
      email: "current@example.com",
      root: true
    });

    expect(adminRepository.findByEmail).not.toHaveBeenCalled();

    expect(adminRepository.update).toHaveBeenCalledWith(adminWithUserMock.id, {
      email: "current@example.com",
      password: adminWithUserMock.password,
      root: true
    });
  });
});
