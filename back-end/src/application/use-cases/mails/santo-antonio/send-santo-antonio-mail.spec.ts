import { QueueAdapter } from "@domain/adapters/queue";
import { DonorRepository } from "@domain/repositories/donor";
import { QueueIntegrationStub } from "@test/stubs/adapters/queue";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { SendSantoAntonioMailUseCase } from "./send-santo-antonio-mail";
import { santoAntonioTemplate } from "@domain/email-templates/email-template";
import { createDonorMail } from "@test/builders/donor-mail";

describe("SendSantoAntonioMailUseCase", () => {
  let sendSantoAntonioMailUseCase: SendSantoAntonioMailUseCase;
  let queueIntegration: QueueAdapter;
  let donorRepository: DonorRepository;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    queueIntegration = new QueueIntegrationStub();
    sendSantoAntonioMailUseCase = new SendSantoAntonioMailUseCase(
      queueIntegration,
      donorRepository
    );
  });

  it("should send santo antonio email to donors", async () => {
    const mockDonors = [createDonorMail(), createDonorMail()];

    jest
      .spyOn(donorRepository, "findAllDonorsMails")
      .mockResolvedValue(mockDonors);
    jest.spyOn(queueIntegration, "addJob");

    await sendSantoAntonioMailUseCase.execute();

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[0].email,
      subject: "Feliz dia de Santo Antonio",
      body: santoAntonioTemplate(
        "Feliz dia de Santo Antonio",
        mockDonors[0].fullName
      )
    });

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[1].email,
      subject: "Feliz dia de Santo Antonio",
      body: santoAntonioTemplate(
        "Feliz dia de Santo Antonio",
        mockDonors[1].fullName
      )
    });
  });
});
