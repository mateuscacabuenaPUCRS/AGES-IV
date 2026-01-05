import { HashAdapter } from "@domain/adapters/hash";
import { HashIntegration } from "@infra/integrations/hash";
import { Module } from "@nestjs/common";

@Module({
  providers: [
    {
      useClass: HashIntegration,
      provide: HashAdapter
    }
  ],
  exports: [HashAdapter]
})
export class HashModule {}
