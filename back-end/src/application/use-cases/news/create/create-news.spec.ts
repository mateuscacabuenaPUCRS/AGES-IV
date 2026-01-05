import { CreateNewsUseCase } from "./create-news";
import { CreateNewsDto } from "@application/dtos/news/create";
import { NewsRepositoryStub } from "@test/stubs/repositories/news";

describe("CreateNewsUseCase", () => {
  let sut: CreateNewsUseCase;
  let newsRepository: NewsRepositoryStub;

  beforeEach(() => {
    newsRepository = new NewsRepositoryStub();
    sut = new CreateNewsUseCase(newsRepository);

    jest.spyOn(newsRepository, "create").mockResolvedValue();
    jest.spyOn(newsRepository, "findById").mockResolvedValue(null);
    jest.spyOn(newsRepository, "findAll").mockResolvedValue({
      data: [],
      page: 1,
      lastPage: 1,
      total: 0
    });

    jest.spyOn(newsRepository, "update").mockResolvedValue();
    jest.spyOn(newsRepository, "delete").mockResolvedValue();
  });

  it("should create a news item with all fields", async () => {
    const dto: CreateNewsDto = {
      title: "Winter Campaign Launched",
      description: "Complete description of the news...",
      date: new Date("2025-08-27"),
      location: "Porto Alegre/RS",
      url: "https://example.com/news"
    };

    await sut.execute(dto);

    expect(newsRepository.create).toHaveBeenCalledWith(dto);
  });

  it("should create a news item with optional fields as null when not provided", async () => {
    const dto: CreateNewsDto = {
      title: "Title only",
      description: "Description only"
    };

    await sut.execute(dto);

    expect(newsRepository.create).toHaveBeenCalledWith({
      title: dto.title,
      description: dto.description,
      date: null,
      location: null,
      url: null
    });
  });

  it("should correctly handle empty optional fields", async () => {
    const dto: CreateNewsDto = {
      title: "Title test",
      description: "Description test",
      date: undefined,
      location: undefined,
      url: undefined
    };

    await sut.execute(dto);

    expect(newsRepository.create).toHaveBeenCalledWith({
      title: dto.title,
      description: dto.description,
      date: null,
      location: null,
      url: null
    });
  });

  it("should throw if repository create fails", async () => {
    const dto: CreateNewsDto = {
      title: "Some title",
      description: "Some description"
    };

    jest
      .spyOn(newsRepository, "create")
      .mockRejectedValueOnce(new Error("DB error"));

    await expect(sut.execute(dto)).rejects.toThrow("DB error");
  });

  it("should trim strings before saving", async () => {
    const dto: CreateNewsDto = {
      title: "   Title with spaces   ",
      description: "   Description with spaces   ",
      location: "   Porto Alegre   "
    };

    await sut.execute(dto);

    expect(newsRepository.create).toHaveBeenCalledWith({
      title: "   Title with spaces   ",
      description: "   Description with spaces   ",
      date: null,
      location: "   Porto Alegre   ",
      url: null
    });
  });
});
