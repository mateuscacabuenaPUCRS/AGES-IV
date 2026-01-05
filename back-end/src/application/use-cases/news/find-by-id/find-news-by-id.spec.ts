import { FindNewsByIdUseCase } from "./find-news-by-id";
import { NewsRepositoryStub } from "@test/stubs/repositories/news";
import { NewsRepository } from "@domain/repositories/news";
import { News } from "@domain/entities/news";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";

describe("FindNewsByIdUseCase", () => {
  let repo: NewsRepository;
  let exceptions: ExceptionsServiceStub;
  let useCase: FindNewsByIdUseCase;

  beforeEach(() => {
    repo = new NewsRepositoryStub();
    exceptions = new ExceptionsServiceStub();
    useCase = new FindNewsByIdUseCase(repo, exceptions);

    jest.spyOn(repo, "findById");
    jest.spyOn(exceptions, "notFound");
  });

  it("should return news when a valid id is provided", async () => {
    const mockNews: News = {
      id: "1",
      title: "Test News",
      description: "Some description",
      date: new Date(),
      location: "Test Location",
      url: "https://example.com",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    (repo.findById as jest.Mock).mockResolvedValueOnce(mockNews);

    const result = await useCase.execute("1");

    expect(repo.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockNews);
  });

  it("should call exceptions.notFound when news does not exist", async () => {
    (repo.findById as jest.Mock).mockResolvedValueOnce(null);

    await useCase.execute("invalid-id");

    expect(exceptions.notFound).toHaveBeenCalledWith({
      message: "News not found"
    });
  });
});
