import { ExceptionsAdapter } from "@domain/adapters/exception";
import { EventRepository } from "@domain/repositories/event";
import { FindEventByIdUseCase } from "./find-event-by-id";
import { EventRepositoryStub } from "@test/stubs/repositories/event";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";

describe("FindEventByIdUseCase", () => {
  let sut: FindEventByIdUseCase;
  let eventRepository: EventRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    eventRepository = new EventRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new FindEventByIdUseCase(eventRepository, exceptionService);
  });

  it("should throw an error when no event is found with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(eventRepository, "findById").mockResolvedValue(null);

    await sut.execute("example-event-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Event not found"
    });
  });
});
