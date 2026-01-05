import {
  CreateEventDTO,
  CreateEventResponses
} from "@application/dtos/event/create";
import { DeleteEventResponses } from "@application/dtos/event/delete";
import {
  FindAllEventsResponse,
  FindAllEventsResponses
} from "@application/dtos/event/find-all";
import {
  EventDetails,
  FindEventByIdResponses
} from "@application/dtos/event/find-by-id";
import {
  UpdateEventDTO,
  UpdateEventResponses
} from "@application/dtos/event/update";
import { PaginationDTO } from "@application/dtos/utils/pagination";
import { CreateEventUseCase } from "@application/use-cases/event/create/create-event";
import { DeleteEventUseCase } from "@application/use-cases/event/delete/delete-event";
import { FindAllEventsUseCase } from "@application/use-cases/event/find-all/find-all-events";
import { FindEventByIdUseCase } from "@application/use-cases/event/find-by-id/find-event-by-id";
import { UpdateEventUseCase } from "@application/use-cases/event/update/update-event";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Events")
@Controller("events")
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
    private readonly findEventByIdUseCase: FindEventByIdUseCase,
    private readonly findAllEventsUseCase: FindAllEventsUseCase
  ) {}

  @Post()
  @CreateEventResponses
  async createEvent(@Body() body: CreateEventDTO): Promise<void> {
    return await this.createEventUseCase.execute(body);
  }

  @Get()
  @FindAllEventsResponses
  async findAllEvents(
    @Query() query: PaginationDTO
  ): Promise<FindAllEventsResponse> {
    return await this.findAllEventsUseCase.execute(query);
  }

  @Get(":id")
  @FindEventByIdResponses
  async findEventById(@Param("id") id: string): Promise<EventDetails | void> {
    return await this.findEventByIdUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(":id")
  @UpdateEventResponses
  async updateEvent(
    @Param("id") id: string,
    @Body() body: UpdateEventDTO
  ): Promise<void> {
    return await this.updateEventUseCase.execute(id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":id")
  @DeleteEventResponses
  async deleteEvent(@Param("id") id: string): Promise<void> {
    return await this.deleteEventUseCase.execute(id);
  }
}
