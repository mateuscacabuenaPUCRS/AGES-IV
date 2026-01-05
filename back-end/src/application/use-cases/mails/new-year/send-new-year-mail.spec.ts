import { QueueAdapter } from "@domain/adapters/queue";
import { DonorRepository } from "@domain/repositories/donor";
import { createDonorMail } from "@test/builders/donor-mail";
import { QueueIntegrationStub } from "@test/stubs/adapters/queue";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { SendNewYearMailUseCase } from "./send-new-year-maill";
import { newYearTemplate } from "@domain/email-templates/email-template";

describe("SendNewYearMailUseCase", () => {
  let sendNewYearMailUseCase: SendNewYearMailUseCase;
  let queueIntegration: QueueAdapter;
  let donorRepository: DonorRepository;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    queueIntegration = new QueueIntegrationStub();
    sendNewYearMailUseCase = new SendNewYearMailUseCase(
      queueIntegration,
      donorRepository
    );
  });

  it("should send new year email to donors", async () => {
    const mockDonors = [createDonorMail(), createDonorMail()];

    jest
      .spyOn(donorRepository, "findAllDonorsMails")
      .mockResolvedValue(mockDonors);
    jest.spyOn(queueIntegration, "addJob");

    await sendNewYearMailUseCase.execute();

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[0].email,
      subject: "Feliz Ano Novo",
      body: newYearTemplate(
        "Feliz Ano Novo",
        mockDonors[0].fullName,
        new Date().getFullYear()
      )
    });

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[1].email,
      subject: "Feliz Ano Novo",
      body: newYearTemplate(
        "Feliz Ano Novo",
        mockDonors[1].fullName,
        new Date().getFullYear()
      )
    });
  });
});
