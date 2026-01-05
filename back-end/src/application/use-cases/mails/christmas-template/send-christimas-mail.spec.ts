import { QueueAdapter } from "@domain/adapters/queue";
import { DonorRepository } from "@domain/repositories/donor";
import { QueueIntegrationStub } from "@test/stubs/adapters/queue";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { SendChristmasMailUseCase } from "./send-christmas-mail";
import { createDonorMail } from "@test/builders/donor-mail";
import { christmasTemplate } from "@domain/email-templates/email-template";

describe("SendChristmasMailUseCase", () => {
  let sendChristmasMailUseCase: SendChristmasMailUseCase;
  let queueIntegration: QueueAdapter;
  let donorRepository: DonorRepository;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    queueIntegration = new QueueIntegrationStub();
    sendChristmasMailUseCase = new SendChristmasMailUseCase(
      queueIntegration,
      donorRepository
    );
  });

  it("should send christmas email to donors", async () => {
    const mockDonors = [createDonorMail(), createDonorMail()];

    jest
      .spyOn(donorRepository, "findAllDonorsMails")
      .mockResolvedValue(mockDonors);
    jest.spyOn(queueIntegration, "addJob");

    await sendChristmasMailUseCase.execute();

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[0].email,
      subject: "Feliz Natal",
      body: christmasTemplate("Feliz Natal", mockDonors[0].fullName)
    });

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[1].email,
      subject: "Feliz Natal",
      body: christmasTemplate("Feliz Natal", mockDonors[1].fullName)
    });
  });
});
