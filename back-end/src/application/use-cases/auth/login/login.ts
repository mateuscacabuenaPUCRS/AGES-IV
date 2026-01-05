import { LoginDTO, LoginResponse } from "@application/dtos/auth/login";
import { ExceptionsAdapter } from "@domain/adapters/exception";
import { HashAdapter } from "@domain/adapters/hash";
import { TokenAdapter } from "@domain/adapters/token";
import { UserRepository } from "@domain/repositories/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenAdapter,
    private readonly hashService: HashAdapter,
    private readonly exceptionService: ExceptionsAdapter
  ) {}

  async execute({ email, password }: LoginDTO): Promise<LoginResponse | void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return this.exceptionService.badRequest({
        message: "Invalid credentials"
      });
    }

    const passwordMatch = await this.hashService.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return this.exceptionService.badRequest({
        message: "Invalid credentials"
      });
    }

    const generateToken = await this.tokenService.generateToken({
      id: user.id,
      role: user.role
    });

    return {
      accessToken: generateToken
    };
  }
}
