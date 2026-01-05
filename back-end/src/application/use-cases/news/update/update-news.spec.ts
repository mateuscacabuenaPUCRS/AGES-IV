import { UpdateNewsUseCase } from "./update-news";
import { NewsRepositoryStub } from "@test/stubs/repositories/news";
import { NewsRepository } from "@domain/repositories/news";
import { UpdateNewsDto } from "@application/dtos/news/update";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { News } from "@domain/entities/news";

describe("UpdateNewsUseCase", () => {
  let repo: NewsRepository;
  let exceptions: ExceptionsServiceStub;
  let useCase: UpdateNewsUseCase;

  beforeEach(() => {
    repo = new NewsRepositoryStub();
    exceptions = new ExceptionsServiceStub();
    useCase = new UpdateNewsUseCase(repo, exceptions);

    jest.spyOn(repo, "findById");
    jest.spyOn(repo, "update");
    jest.spyOn(exceptions, "badRequest");
    jest.spyOn(exceptions, "notFound");
  });

  it("should call repository update with correct parameters", async () => {
    const dto: UpdateNewsDto = {
      title: "Updated Title",
      description: "Updated description",
      date: new Date("2025-09-05"),
      location: "New Location",
      url: "https://updated.com"
    };

    (repo.findById as jest.Mock).mockResolvedValueOnce({
      id: "news-id-123"
    } as unknown as News);

    await useCase.execute("news-id-123", dto);

    expect(repo.update).toHaveBeenCalledWith("news-id-123", {
      title: dto.title,
      description: dto.description,
      date: new Date(dto.date),
      location: dto.location,
      url: dto.url
    });
  });

  it("should call exceptions.badRequest when no fields provided", async () => {
    const dto: UpdateNewsDto = {};
    (repo.findById as jest.Mock).mockResolvedValueOnce({
      id: "news-id-123"
    } as unknown as News);

    await useCase.execute("news-id-123", dto);

    expect(exceptions.badRequest).toHaveBeenCalledWith({
      message: "No fields provided to update"
    });
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("should call exceptions.notFound when news does not exist", async () => {
    const dto: UpdateNewsDto = { title: "Anything" };
    (repo.findById as jest.Mock).mockResolvedValueOnce(null);

    await useCase.execute("non-existing-id", dto);

    expect(exceptions.notFound).toHaveBeenCalledWith({
      message: "News not found"
    });
    expect(repo.update).not.toHaveBeenCalled();
  });
});
