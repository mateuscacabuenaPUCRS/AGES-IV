import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionModule } from "../exception";
import { HashModule } from "../hash";
import { DonorController } from "@infra/controllers/donor";
import { CreateDonorUseCase } from "@application/use-cases/donor/create/create-donor";
import { DeleteDonorUseCase } from "@application/use-cases/donor/delete/delete-donor";
import { FindAllDonorsUseCase } from "@application/use-cases/donor/find-all/find-all-donors";
import { FindDonorByIdUseCase } from "@application/use-cases/donor/find-by-id/find-donor-by-id";
import { UpdateDonorUseCase } from "@application/use-cases/donor/update/update-donor";
import { UpdateDonorAvatarUseCase } from "@application/use-cases/donor/update-avatar/update-avatar";
import { FileModule } from "../file";
import { FindDonorInformationsUseCase } from "@application/use-cases/donor/find-informations";
import { FindDonationByDonorIdUseCase } from "@application/use-cases/donor/find-donation-by-donor-id";

@Module({
  imports: [DatabaseModule, ExceptionModule, HashModule, FileModule],
  controllers: [DonorController],
  providers: [
    CreateDonorUseCase,
    UpdateDonorUseCase,
    UpdateDonorAvatarUseCase,
    DeleteDonorUseCase,
    FindDonorByIdUseCase,
    FindAllDonorsUseCase,
    FindDonorInformationsUseCase,
    FindDonationByDonorIdUseCase
  ]
})
export class DonorModule {}
