import { ExceptionsAdapter } from "@domain/adapters/exception";
import { DonorRepository } from "@domain/repositories/donor";
import { createMockDonorWithUser } from "@test/builders/donor";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { FileUseCaseStub } from "@test/stubs/use-cases/file";
import { UpdateDonorAvatarUseCase } from "./update-avatar";
import { CreateFileUseCase } from "@application/use-cases/file/create/create-file";
import { CreateFileDTO } from "@application/dtos/file/create";

describe("UpdateDonorAvatarUseCase", () => {
  let sut: UpdateDonorAvatarUseCase;
  let donorRepository: DonorRepository;
  let exceptionService: ExceptionsAdapter;
  let createFileUseCase: FileUseCaseStub;
  const file: CreateFileDTO = {
    buffer: Buffer.from(""),
    mimetype: "image/png",
    originalname: "test.png"
  };

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    createFileUseCase = new FileUseCaseStub();

    sut = new UpdateDonorAvatarUseCase(
      donorRepository,
      exceptionService,
      createFileUseCase as unknown as CreateFileUseCase
    );
  });

  it("should throw an error when not found a donor with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(donorRepository, "findByIdWithUser").mockResolvedValue(null);
    jest.spyOn(donorRepository, "update");

    await sut.execute("example-donor-id", file);

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Donor not found"
    });

    expect(donorRepository.update).not.toHaveBeenCalled();
  });

  it("should update a donor avatar", async () => {
    const donorWithUserMock = createMockDonorWithUser();
    const mockAvatar = {
      url: "https://bucket.s3.amazonaws.com/test.png",
      key: "some-key",
      contentType: "image/png",
      size: 1234
    };

    jest
      .spyOn(donorRepository, "findByIdWithUser")
      .mockResolvedValue(donorWithUserMock);
    jest.spyOn(donorRepository, "update");
    jest.spyOn(createFileUseCase, "execute").mockResolvedValue(mockAvatar);

    await sut.execute(donorWithUserMock.id, file);

    expect(createFileUseCase.execute).toHaveBeenCalledWith(file);
    expect(donorRepository.update).toHaveBeenCalledWith(donorWithUserMock.id, {
      imageUrl: mockAvatar.url
    });
  });
});
