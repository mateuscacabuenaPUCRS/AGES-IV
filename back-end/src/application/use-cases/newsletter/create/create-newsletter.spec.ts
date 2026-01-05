import { CreateNewsletterUseCase } from "./create-newsletter";
import { NewsletterRepositoryStub } from "@test/stubs/repositories/newsletter";
import { NewsletterRepository } from "@domain/repositories/newsletter";
import { Newsletter } from "@domain/entities/newsletter";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { CreateNewsletterDto } from "@application/dtos/newsletter/create";

describe("CreateNewsletterUseCase", () => {
  let repo: NewsletterRepository;
  let exceptions: ExceptionsServiceStub;
  let useCase: CreateNewsletterUseCase;

  beforeEach(() => {
    repo = new NewsletterRepositoryStub();
    exceptions = new ExceptionsServiceStub();
    useCase = new CreateNewsletterUseCase(repo, exceptions);

    jest.spyOn(repo, "findByEmail");
    jest.spyOn(repo, "create");
    jest.spyOn(exceptions, "conflict");
  });

  it("should create newsletter subscription successfully when email doesn't exist", async () => {
    const dto: CreateNewsletterDto = {
      email: "newuser@example.com"
    };

    (repo.findByEmail as jest.Mock).mockResolvedValueOnce(null);

    const result = await useCase.execute(dto);

    expect(repo.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(repo.create).toHaveBeenCalledWith({ email: dto.email });
    expect(exceptions.conflict).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: "Inscrição realizada com sucesso"
    });
  });

  it("should find newsletter subscription by email", async () => {
    const dto: CreateNewsletterDto = {
      email: "existing@example.com"
    };
    const mockNewsletter = new Newsletter();
    (repo.findByEmail as jest.Mock).mockResolvedValueOnce(mockNewsletter);

    await useCase.execute(dto);

    expect(repo.findByEmail).toHaveBeenCalledWith(dto.email);
  });

  it("should return null when newsletter subscription is not found", async () => {
    const dto: CreateNewsletterDto = {
      email: "non-existing@example.com"
    };
    (repo.findByEmail as jest.Mock).mockResolvedValueOnce(null);

    await useCase.execute(dto);

    expect(repo.findByEmail).toHaveBeenCalledWith(dto.email);
  });
});
