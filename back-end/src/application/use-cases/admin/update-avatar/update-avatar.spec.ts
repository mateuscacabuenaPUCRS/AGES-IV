import { ExceptionsAdapter } from "@domain/adapters/exception";
import { AdminRepository } from "@domain/repositories/admin";
import { createMockAdminWithUser } from "@test/builders/admin";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { AdminRepositoryStub } from "@test/stubs/repositories/admin";
import { FileUseCaseStub } from "@test/stubs/use-cases/file";
import { UpdateAdminAvatarUseCase } from "./update-avatar";
import { CreateFileDTO } from "@application/dtos/file/create";
import { CreateFileUseCase } from "@application/use-cases/file/create/create-file";

describe("UpdateAdminAvatarUseCase", () => {
  let sut: UpdateAdminAvatarUseCase;
  let adminRepository: AdminRepository;
  let exceptionService: ExceptionsAdapter;
  let createFileUseCase: FileUseCaseStub;
  const file: CreateFileDTO = {
    buffer: Buffer.from(""),
    mimetype: "image/png",
    originalname: "test.png"
  };

  beforeEach(() => {
    adminRepository = new AdminRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    createFileUseCase = new FileUseCaseStub();

    sut = new UpdateAdminAvatarUseCase(
      adminRepository,
      exceptionService,
      createFileUseCase as unknown as CreateFileUseCase
    );
  });

  it("should throw an error when not found an admin with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(adminRepository, "findByIdWithUser").mockResolvedValue(null);
    jest.spyOn(adminRepository, "update");

    await sut.execute("example-admin-id", file);

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Admin not found"
    });
    expect(adminRepository.update).not.toHaveBeenCalled();
  });

  it("should update an admin avatar", async () => {
    const adminWithUserMock = createMockAdminWithUser();
    const mockAvatar = {
      url: "https://bucket.s3.amazonaws.com/test.png",
      key: "some-key",
      contentType: "image/png",
      size: 1234
    };

    jest
      .spyOn(adminRepository, "findByIdWithUser")
      .mockResolvedValue(adminWithUserMock);
    jest.spyOn(adminRepository, "update");
    jest.spyOn(createFileUseCase, "execute").mockResolvedValue(mockAvatar);

    await sut.execute(adminWithUserMock.id, file);

    expect(createFileUseCase.execute).toHaveBeenCalledWith(file);
    expect(adminRepository.update).toHaveBeenCalledWith(adminWithUserMock.id, {
      imageUrl: mockAvatar.url
    });
  });
});
