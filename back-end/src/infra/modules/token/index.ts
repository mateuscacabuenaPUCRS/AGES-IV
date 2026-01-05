import { TokenAdapter } from "@domain/adapters/token";
import { TokenIntegration } from "@infra/integrations/token";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "24h" }
    })
  ],
  providers: [
    {
      provide: TokenAdapter,
      useClass: TokenIntegration
    }
  ],
  exports: [TokenAdapter]
})
export class TokenModule {}
