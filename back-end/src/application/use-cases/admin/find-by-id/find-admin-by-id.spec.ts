import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { FindAdminByIdUseCase } from "./find-admin-by-id";
import { AdminRepositoryStub } from "@test/stubs/repositories/admin";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { createMockAdminWithUser } from "@test/builders/admin";

describe("FindAdminByIdUseCase", () => {
  let sut: FindAdminByIdUseCase;
  let adminRepository: AdminRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    adminRepository = new AdminRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new FindAdminByIdUseCase(adminRepository, exceptionService);
  });

  it("should throw an error when not found an admin with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(adminRepository, "findByIdWithUser").mockResolvedValue(null);

    await sut.execute("example-admin-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Admin not found"
    });
  });

  it("should return admin details", async () => {
    const mockAdminWithUser = createMockAdminWithUser();

    jest.spyOn(exceptionService, "notFound");
    jest
      .spyOn(adminRepository, "findByIdWithUser")
      .mockResolvedValue(mockAdminWithUser);

    const result = await sut.execute("example-admin-id");

    expect(result).toEqual({
      id: mockAdminWithUser.id,
      fullName: mockAdminWithUser.fullName,
      email: mockAdminWithUser.email,
      root: mockAdminWithUser.root,
      imageUrl: mockAdminWithUser.imageUrl
    });

    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });
});
