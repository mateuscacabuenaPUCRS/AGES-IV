import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { HashModule } from "../hash";
import { TokenModule } from "../token";
import { AdminController } from "@infra/controllers/admin";
import { ExceptionModule } from "../exception";
import { FindAdminByIdUseCase } from "@application/use-cases/admin/find-by-id/find-admin-by-id";
import { CreateAdminUseCase } from "@application/use-cases/admin/create/create-admin";
import { UpdateAdminUseCase } from "@application/use-cases/admin/update/update-admin";
import { UpdateAdminAvatarUseCase } from "@application/use-cases/admin/update-avatar/update-avatar";
import { DeleteAdminUseCase } from "@application/use-cases/admin/delete/delete-admin";
import { FindAllAdminsUseCase } from "@application/use-cases/admin/find-all/find-all-admins";
import { AuthTokenGuard } from "@infra/commons/guards/token";
import { RoleGuard } from "@infra/commons/guards/role";
import { FileModule } from "../file";

@Module({
  imports: [
    DatabaseModule,
    ExceptionModule,
    HashModule,
    TokenModule,
    FileModule
  ],
  controllers: [AdminController],
  providers: [
    CreateAdminUseCase,
    UpdateAdminUseCase,
    UpdateAdminAvatarUseCase,
    DeleteAdminUseCase,
    FindAdminByIdUseCase,
    FindAllAdminsUseCase,
    AuthTokenGuard,
    RoleGuard
  ]
})
export class AdminModule {}
