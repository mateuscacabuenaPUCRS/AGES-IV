import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionModule } from "../exception";
import { DonationController } from "../../controllers/donation";
import { CreateDonationUseCase } from "@application/use-cases/donation/create/create-donation";
import { DeleteDonationUseCase } from "@application/use-cases/donation/delete/delete-donation";
import { FindAllDonationsUseCase } from "@application/use-cases/donation/find-all/find-all-donations";
import { FindDonationByIdUseCase } from "@application/use-cases/donation/find-by-id/find-donation-by-id";
import { UpdateDonationUseCase } from "@application/use-cases/donation/update/update-donation";
import { TransactionModule } from "../transaction";
import { TokenModule } from "../token";

@Module({
  imports: [DatabaseModule, ExceptionModule, TransactionModule, TokenModule],
  controllers: [DonationController],
  providers: [
    CreateDonationUseCase,
    UpdateDonationUseCase,
    DeleteDonationUseCase,
    FindDonationByIdUseCase,
    FindAllDonationsUseCase
  ]
})
export class DonationModule {}
