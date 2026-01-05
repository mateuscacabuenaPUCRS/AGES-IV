import { ExceptionsAdapter } from "@domain/adapters/exception";
import { EventRepository } from "@domain/repositories/event";
import { createMockEvent } from "@test/builders/event";
import { ExceptionsServiceStub } from "@test/stubs/adapters/exceptions";
import { EventRepositoryStub } from "@test/stubs/repositories/event";
import { DeleteEventUseCase } from "./delete-event";

describe("DeleteEventUseCase", () => {
  let sut: DeleteEventUseCase;
  let eventRepository: EventRepository;
  let exceptionService: ExceptionsAdapter;

  beforeEach(() => {
    eventRepository = new EventRepositoryStub();
    exceptionService = new ExceptionsServiceStub();
    sut = new DeleteEventUseCase(eventRepository, exceptionService);
  });

  it("should throw an error when no event is found with that id", async () => {
    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(eventRepository, "findById").mockResolvedValue(null);
    jest.spyOn(eventRepository, "delete");

    await sut.execute("example-event-id");

    expect(exceptionService.notFound).toHaveBeenCalledWith({
      message: "Event not found"
    });

    expect(eventRepository.delete).not.toHaveBeenCalled();
  });

  it("should delete an event", async () => {
    const eventMock = createMockEvent();

    jest.spyOn(exceptionService, "notFound");
    jest.spyOn(eventRepository, "findById").mockResolvedValue(eventMock);
    jest.spyOn(eventRepository, "delete");

    await sut.execute(eventMock.id);

    expect(eventRepository.delete).toHaveBeenCalledWith(eventMock.id);
    expect(exceptionService.notFound).not.toHaveBeenCalled();
  });
});
