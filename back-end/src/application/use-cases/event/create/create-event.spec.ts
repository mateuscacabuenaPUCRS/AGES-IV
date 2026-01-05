import { ExceptionsAdapter } from "@domain/adapters/exception";
import { EventRepository } from "@domain/repositories/event";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { EventRepositoryStub } from "@test/stubs/repositories/event";
import { CreateEventUseCase } from "./create-event";
import { createMockEvent } from "@test/builders/event";

describe("CreateEventUseCase", () => {
  let sut: CreateEventUseCase;
  let eventRepository: EventRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    eventRepository = new EventRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new CreateEventUseCase(eventRepository, exceptionService);
  });

  it("should throw conflict error when event with same title and date exists", async () => {
    const mockEvent = createMockEvent();

    jest.spyOn(exceptionService, "conflict");
    jest
      .spyOn(eventRepository, "findByTitleAndDate")
      .mockResolvedValue(mockEvent);

    await sut.execute({
      title: mockEvent.title,
      description: "Some description",
      location: "Some location",
      dateStart: mockEvent.dateStart,
      dateEnd: mockEvent.dateEnd
    });

    expect(eventRepository.findByTitleAndDate).toHaveBeenCalledWith(
      mockEvent.title,
      mockEvent.dateStart
    );
    expect(exceptionService.conflict).toHaveBeenCalledWith({
      message: "Event with this title and date already exists"
    });
  });

  it("should create an event successfully", async () => {
    jest.spyOn(eventRepository, "findByTitleAndDate").mockResolvedValue(null);
    jest.spyOn(eventRepository, "create").mockResolvedValue(undefined);

    const input = {
      title: "New event title",
      description: "Event description",
      location: "Rua example, 123",
      dateStart: new Date("2100-01-01"),
      dateEnd: new Date("2100-01-02")
    };

    await sut.execute(input);

    expect(eventRepository.create).toHaveBeenCalledWith({
      title: input.title,
      description: input.description,
      location: input.location,
      dateStart: input.dateStart,
      dateEnd: input.dateEnd
    });
  });
});
