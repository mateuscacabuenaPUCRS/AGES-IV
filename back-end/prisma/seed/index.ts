import { PrismaClient } from "@prisma/client";
import { clearDb } from "./clear-db";
import { userDonorsMock, userAdminsMock } from "../mocks/user";
import { eventsMock } from "../mocks/events";
import { newsMock } from "../mocks/news";
import { newsletterMock } from "../mocks/newsletter";
import { addressesMock } from "../mocks/addresses";
import { campaignsMock } from "../mocks/campaigns";
import { donationsMock } from "../mocks/donations";
import { paymentsMock } from "../mocks/payments";
import { howToHelpMock } from "../mocks/how-to-help";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log("Starting seed...");

  await clearDb();

  const createdDonorUsers = [];
  const createdAdmins = [];

  for(const howToHelpData of howToHelpMock) {
    if (howToHelpData.id) {
    await prisma.howToHelp.upsert(
      {
        where: { id: howToHelpData.id },
        update: {},
        create: howToHelpData
      }
    );
  }
  }

  for (const userData of userDonorsMock) {
    const user = await prisma.user.create({
      data: userData,
      include: { donor: true }
    });
    if (user.donor) {
      createdDonorUsers.push(user.id);
    }
  }

  for (const adminData of userAdminsMock) {
    const user = await prisma.user.create({
      data: adminData,
      include: { admin: true }
    });
    createdAdmins.push(user.id);
  }

  for (
    let i = 0;
    i < Math.min(addressesMock.length, createdDonorUsers.length);
    i++
  ) {
    const user = await prisma.user.findUnique({
      where: { id: createdDonorUsers[i] },
      include: { donor: true }
    });

    const addressData = {
      ...addressesMock[i],
      donor: {
        connect: { id: user.donor.id }
      }
    };

    await prisma.address.create({
      data: addressData
    });
  }

  console.log("Creating campaigns...");
  const createdCampaigns = [];
  const campaigns = campaignsMock(createdAdmins, createdDonorUsers);

  for (const campaignData of campaigns) {
    const campaign = await prisma.campaign.create({
      data: campaignData
    });
    createdCampaigns.push(campaign.id);
  }

  console.log("Creating donations...");
  const createdDonations = [];

  const donorIds = [];
  for (const userId of createdDonorUsers) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { donor: true }
    });
    if (user?.donor) {
      donorIds.push(user.donor.id);
    }
  }

  const donations = donationsMock(createdCampaigns, donorIds);

  for (const donationData of donations) {
    const donation = await prisma.donation.create({
      data: donationData
    });
    createdDonations.push(donation.id);
  }

  console.log("Creating payments...");
  const payments = paymentsMock(createdDonations);

  for (let i = 0; i < payments.length; i++) {
    const paymentData = payments[i];

    const donation = await prisma.donation.findUnique({
      where: { id: createdDonations[i] }
    });

    if (donation) {
      await prisma.payment.create({
        data: {
          ...paymentData,
          amount: donation.amount
        }
      });
    }
  }

  for (const eventsData of eventsMock) {
    await prisma.events.create({
      data: eventsData
    });
  }

  for (const newsData of newsMock) {
    await prisma.news.create({
      data: newsData
    });
  }

  for (const newsletterData of newsletterMock) {
    await prisma.newsletter.create({
      data: newsletterData
    });
  }
}

main()
  .then(() => {
    console.log("Seed completed ✅");
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
