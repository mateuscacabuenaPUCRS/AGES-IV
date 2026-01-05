import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database";
import { ExceptionModule } from "../exception";
import { HashModule } from "../hash";
import { EventController } from "@infra/controllers/event";
import { CreateEventUseCase } from "@application/use-cases/event/create/create-event";
import { DeleteEventUseCase } from "@application/use-cases/event/delete/delete-event";
import { FindAllEventsUseCase } from "@application/use-cases/event/find-all/find-all-events";
import { FindEventByIdUseCase } from "@application/use-cases/event/find-by-id/find-event-by-id";
import { UpdateEventUseCase } from "@application/use-cases/event/update/update-event";

@Module({
  imports: [DatabaseModule, ExceptionModule, HashModule],
  controllers: [EventController],
  providers: [
    CreateEventUseCase,
    UpdateEventUseCase,
    DeleteEventUseCase,
    FindEventByIdUseCase,
    FindAllEventsUseCase
  ]
})
export class EventModule {}
