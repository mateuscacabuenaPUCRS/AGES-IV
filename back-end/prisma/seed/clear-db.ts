import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function clearDb(): Promise<void> {
  await prisma.payment.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.address.deleteMany();
  await prisma.newsletter.deleteMany();
  await prisma.events.deleteMany();
  await prisma.news.deleteMany();
  await prisma.user.deleteMany();
}
