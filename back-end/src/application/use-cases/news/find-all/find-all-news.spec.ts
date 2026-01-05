import { FindAllNewsUseCase } from "./find-all-news";
import { NewsRepository } from "@domain/repositories/news";
import { NewsRepositoryStub } from "@test/stubs/repositories/news";
import { PaginatedEntity } from "@domain/constants/pagination";
import { News } from "@domain/entities/news";
describe("FindAllNewsUseCase", () => {
  let repo: NewsRepository;
  let useCase: FindAllNewsUseCase;

  beforeEach(() => {
    repo = new NewsRepositoryStub();
    useCase = new FindAllNewsUseCase(repo);

    jest.spyOn(repo, "findAll");
  });

  it("should return paginated news list", async () => {
    const mockResult: PaginatedEntity<News> = {
      data: [
        {
          id: "1",
          title: "Test News",
          description: "Some description",
          date: new Date(),
          location: "Test Location",
          url: "https://example.com",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      page: 1,
      lastPage: 1,
      total: 1
    };

    (repo.findAll as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await useCase.execute({
      page: 1,
      pageSize: 10
    });

    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    expect(result).toEqual(mockResult);
  });

  it("should apply default pagination when no params are provided", async () => {
    const mockResult: PaginatedEntity<News> = {
      data: [],
      page: 1,
      lastPage: 0,
      total: 0
    };

    (repo.findAll as jest.Mock).mockResolvedValueOnce(mockResult);

    const result = await useCase.execute({
      page: 1,
      pageSize: 10
    });

    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    expect(result).toEqual(mockResult);
  });
});
