import { FindAllEventsUseCase } from "./find-all-events";
import { EventRepository } from "@domain/repositories/event";
import { EventRepositoryStub } from "@test/stubs/repositories/event";
import { Event } from "@domain/entities/event";

describe("FindAllEventsUseCase (ordenado e filtrado)", () => {
  let sut: FindAllEventsUseCase;
  let eventRepository: EventRepository;

  beforeEach(() => {
    eventRepository = new EventRepositoryStub();
    sut = new FindAllEventsUseCase(eventRepository);
  });

  it("should return events ordered by date ascending and only future ones", async () => {
    const now = new Date("2025-10-11T00:00:00Z");

    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Evento Passado",
        description: "Já aconteceu",
        dateStart: new Date("2025-10-01T00:00:00Z"),
        dateEnd: new Date("2025-10-01T23:59:59Z"),
        location: "Local 1",
        url: "http://evento1.com"
      },
      {
        id: "2",
        title: "Evento Amanhã",
        description: "Futuro próximo",
        dateStart: new Date("2025-10-12T00:00:00Z"),
        dateEnd: new Date("2025-10-12T23:59:59Z"),
        location: "Local 2",
        url: "http://evento2.com"
      },
      {
        id: "3",
        title: "Evento Semana que Vem",
        description: "Mais distante",
        dateStart: new Date("2025-10-18T00:00:00Z"),
        dateEnd: new Date("2025-10-18T23:59:59Z"),
        location: "Local 3",
        url: "http://evento3.com"
      }
    ] as unknown as Event[];

    jest.spyOn(eventRepository, "findAll").mockResolvedValue({
      data: mockEvents
        .filter((e) => e.dateStart >= now)
        .sort((a, b) => a.dateStart.getTime() - b.dateStart.getTime()),
      total: 2,
      page: 1,
      lastPage: 1
    });

    const result = await sut.execute({ page: 1, pageSize: 10 });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].title).toBe("Evento Amanhã");
    expect(result.data[1].title).toBe("Evento Semana que Vem");
    expect(result.data[0].dateStart < result.data[1].dateStart).toBeTruthy();
  });

  it("should return empty list when there are no future events", async () => {
    jest.spyOn(eventRepository, "findAll").mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      lastPage: 0
    });

    const result = await sut.execute({ page: 1, pageSize: 10 });

    expect(result.data).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("should call repository with pagination params", async () => {
    const page = 1;
    const pageSize = 5;

    const spy = jest.spyOn(eventRepository, "findAll").mockResolvedValue({
      data: [],
      total: 0,
      page,
      lastPage: 0
    });

    await sut.execute({ page, pageSize });

    expect(spy).toHaveBeenCalledWith({ page, pageSize });
  });
});
