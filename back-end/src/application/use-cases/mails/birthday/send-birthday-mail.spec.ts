import { DonorRepository } from "@domain/repositories/donor";
import { SendBirthdayMailUseCase } from "./send-birthday-mail";
import { DonorRepositoryStub } from "@test/stubs/repositories/donor";
import { QueueIntegrationStub } from "@test/stubs/adapters/queue";
import { QueueAdapter } from "@domain/adapters/queue";
import { createDonorMail } from "@test/builders/donor-mail";
import { birthdayTemplate } from "@domain/email-templates/email-template";

describe("SendBirthdayMailUseCase", () => {
  let sendBirthdayMailUseCase: SendBirthdayMailUseCase;
  let queueIntegration: QueueAdapter;
  let donorRepository: DonorRepository;

  beforeEach(() => {
    donorRepository = new DonorRepositoryStub();
    queueIntegration = new QueueIntegrationStub();
    sendBirthdayMailUseCase = new SendBirthdayMailUseCase(
      queueIntegration,
      donorRepository
    );
  });

  it("should send birthday email to donors", async () => {
    const mockDonors = [createDonorMail(), createDonorMail()];

    jest
      .spyOn(donorRepository, "findAllDonorsWithBirthday")
      .mockResolvedValue(mockDonors);
    jest.spyOn(queueIntegration, "addJob");

    await sendBirthdayMailUseCase.execute();

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[0].email,
      subject: "Feliz Aniversário",
      body: birthdayTemplate("Feliz Aniversário", mockDonors[0].fullName)
    });

    expect(queueIntegration.addJob).toHaveBeenCalledWith({
      to: mockDonors[1].email,
      subject: "Feliz Aniversário",
      body: birthdayTemplate("Feliz Aniversário", mockDonors[1].fullName)
    });
  });
});
