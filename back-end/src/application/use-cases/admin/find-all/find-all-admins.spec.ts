import { AdminRepository } from "@domain/repositories/admin";
import { FindAllAdminsUseCase } from "./find-all-admins";
import { AdminRepositoryStub } from "@test/stubs/repositories/admin";

describe("FindAllAdminsUseCase", () => {
  let sut: FindAllAdminsUseCase;
  let adminRepository: AdminRepository;

  beforeEach(() => {
    adminRepository = new AdminRepositoryStub();
    sut = new FindAllAdminsUseCase(adminRepository);
  });

  it("should return all admins paginated", async () => {
    const page = 1;
    const pageSize = 10;

    jest.spyOn(adminRepository, "findAll");

    await sut.execute({
      page,
      pageSize
    });

    expect(adminRepository.findAll).toHaveBeenCalledWith({ page, pageSize });
  });
});
