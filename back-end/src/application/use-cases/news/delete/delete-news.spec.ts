import { DeleteNewsUseCase } from "./delete-news";
import { NewsRepository } from "@domain/repositories/news";
import { News } from "@domain/entities/news";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";

describe("DeleteNewsUseCase", () => {
  let repo: jest.Mocked<NewsRepository>;
  let exceptions: ExceptionsServiceStub;
  let useCase: DeleteNewsUseCase;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn()
    } as unknown as jest.Mocked<NewsRepository>;

    exceptions = new ExceptionsServiceStub();
    useCase = new DeleteNewsUseCase(repo, exceptions);

    jest.spyOn(exceptions, "notFound");
  });

  it("should delete an existing news", async () => {
    repo.findById.mockResolvedValueOnce({ id: "valid-id" } as unknown as News);
    repo.delete.mockResolvedValueOnce();

    await useCase.execute("valid-id");

    expect(repo.delete).toHaveBeenCalledWith("valid-id");
  });

  it("should call exceptions.notFound when the news does not exist", async () => {
    repo.findById.mockResolvedValueOnce(null);

    await useCase.execute("invalid-id");

    expect(exceptions.notFound).toHaveBeenCalledWith({
      message: "News not found"
    });
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
