import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { createMockAdmin } from "@test/builders/admin";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { AdminRepositoryStub } from "@test/stubs/repositories/admin";
import { DeleteAdminUseCase } from "./delete-admin";

describe("DeleteAdminUseCase", () => {
  let sut: DeleteAdminUseCase;
  let adminRepository: AdminRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    adminRepository = new AdminRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new DeleteAdminUseCase(adminRepository, exceptionService);
  });

  it("should throw an error when admin to delete is not found", async () => {
    const currentAdminMock = createMockAdmin({ root: true });

    jest.spyOn(exceptionService, "notFound");
    jest
      .spyOn(adminRepository, "findById")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(currentAdminMock);
    jest.spyOn(adminRepository, "delete");

    await sut.execute({
      adminId: "non-existent-id",
      currentUserId: currentAdminMock.id
    });

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Admin not found"
    });

    expect(adminRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw an error when current admin is not found", async () => {
    const adminToDeleteMock = createMockAdmin({ root: false });

    jest.spyOn(exceptionService, "notFound");
    jest
      .spyOn(adminRepository, "findById")
      .mockResolvedValueOnce(adminToDeleteMock)
      .mockResolvedValueOnce(null);
    jest.spyOn(adminRepository, "delete");

    await sut.execute({
      adminId: adminToDeleteMock.id,
      currentUserId: "non-existent-current-user"
    });

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Current admin not found"
    });

    expect(adminRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw forbidden error when non-root admin tries to delete root admin", async () => {
    const rootAdminToDelete = createMockAdmin({ root: true });
    const nonRootCurrentAdmin = createMockAdmin({ root: false });

    jest.spyOn(exceptionService, "forbidden");
    jest
      .spyOn(adminRepository, "findById")
      .mockResolvedValueOnce(rootAdminToDelete)
      .mockResolvedValueOnce(nonRootCurrentAdmin);
    jest.spyOn(adminRepository, "delete");

    await sut.execute({
      adminId: rootAdminToDelete.id,
      currentUserId: nonRootCurrentAdmin.id
    });

    expect(exceptionService.forbidden).toHaveBeenCalledWith({
      message: "Only root administrators can delete admins"
    });

    expect(adminRepository.delete).not.toHaveBeenCalled();
  });

  it("should allow root admin to delete root admin", async () => {
    const rootAdminToDelete = createMockAdmin({ root: true });
    const rootCurrentAdmin = createMockAdmin({ root: true });

    jest.spyOn(exceptionService, "forbidden");
    jest
      .spyOn(adminRepository, "findById")
      .mockResolvedValueOnce(rootAdminToDelete)
      .mockResolvedValueOnce(rootCurrentAdmin);
    jest.spyOn(adminRepository, "delete");

    await sut.execute({
      adminId: rootAdminToDelete.id,
      currentUserId: rootCurrentAdmin.id
    });

    expect(adminRepository.delete).toHaveBeenCalledWith(rootAdminToDelete.id);
    expect(exceptionService.forbidden).not.toHaveBeenCalled();
  });

  it("should allow root admin to delete non-root admin", async () => {
    const nonRootAdminToDelete = createMockAdmin({ root: false });
    const rootCurrentAdmin = createMockAdmin({ root: true });

    jest.spyOn(exceptionService, "forbidden");
    jest
      .spyOn(adminRepository, "findById")
      .mockResolvedValueOnce(nonRootAdminToDelete)
      .mockResolvedValueOnce(rootCurrentAdmin);
    jest.spyOn(adminRepository, "delete");

    await sut.execute({
      adminId: nonRootAdminToDelete.id,
      currentUserId: rootCurrentAdmin.id
    });

    expect(adminRepository.delete).toHaveBeenCalledWith(
      nonRootAdminToDelete.id
    );
    expect(exceptionService.forbidden).not.toHaveBeenCalled();
  });

  it("should forbid non-root admin deleting non-root admin", async () => {
    const nonRootAdminToDelete = createMockAdmin({ root: false });
    const nonRootCurrentAdmin = createMockAdmin({ root: false });

    jest.spyOn(exceptionService, "forbidden");
    jest
      .spyOn(adminRepository, "findById")
      .mockResolvedValueOnce(nonRootAdminToDelete)
      .mockResolvedValueOnce(nonRootCurrentAdmin);
    jest.spyOn(adminRepository, "delete");

    await sut.execute({
      adminId: nonRootAdminToDelete.id,
      currentUserId: nonRootCurrentAdmin.id
    });

    expect(exceptionService.forbidden).toHaveBeenCalledWith({
      message: "Only root administrators can delete admins"
    });
    expect(adminRepository.delete).not.toHaveBeenCalled();
  });
});
