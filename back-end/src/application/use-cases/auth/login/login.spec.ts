import { UserRepositoryStub } from "@test/stubs/repositories/user";
import { LoginUseCase } from "./login";
import { TokenServiceStub } from "@test/stubs/adapters/token";
import { HashServiceStub } from "@test/stubs/adapters/hash";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { TokenAdapter } from "@domain/adapters/token";
import { UserRepository } from "@domain/repositories/user";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { createMockUser } from "@test/builders/user";

describe("LoginUseCase", () => {
  let sut: LoginUseCase;
  let userRepository: UserRepository;
  let tokenService: TokenAdapter;
  let hashService: HashAdapter;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    userRepository = new UserRepositoryStub();
    tokenService = new TokenServiceStub();
    hashService = new HashServiceStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new LoginUseCase(
      userRepository,
      tokenService,
      hashService,
      exceptionService
    );
  });

  it("should throw invalid credentials when not found a email", async () => {
    jest.spyOn(exceptionService, "badRequest");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    jest.spyOn(hashService, "compare");

    await sut.execute({
      email: "johndoe@example.com",
      password: "Senha@123"
    });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      "johndoe@example.com"
    );
    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Invalid credentials"
    });
    expect(hashService.compare).not.toHaveBeenCalled();
  });

  it("should throw invalid credentials when passwords dont match", async () => {
    const userMock = createMockUser();

    jest.spyOn(exceptionService, "badRequest");
    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(userMock);
    jest.spyOn(hashService, "compare").mockResolvedValue(false);

    await sut.execute({
      email: "johndoe@example.com",
      password: "Senha@123"
    });

    expect(hashService.compare).toHaveBeenCalledWith(
      "Senha@123",
      userMock.password
    );
    expect(exceptionService.badRequest).toHaveBeenCalledWith({
      message: "Invalid credentials"
    });
  });

  it("should return access token", async () => {
    const userMock = createMockUser();

    const token = "token";

    jest.spyOn(userRepository, "findByEmail").mockResolvedValue(userMock);
    jest.spyOn(hashService, "compare").mockResolvedValue(true);
    jest.spyOn(tokenService, "generateToken").mockResolvedValue(token);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "Senha@123"
    });

    expect(tokenService.generateToken).toHaveBeenCalledWith({
      id: userMock.id,
      role: userMock.role
    });
    expect(result).toEqual({
      accessToken: token
    });
  });
});
