/*
  Warnings:

  - You are about to drop the column `impact_area` on the `donations` table. All the data in the column will be lost.
  - The `periodicity` column on the `donations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Periodicity" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'YEARLY');

-- DropForeignKey
ALTER TABLE "donations" DROP CONSTRAINT "donations_donor_id_fkey";

-- AlterTable
ALTER TABLE "donations" DROP COLUMN "impact_area",
DROP COLUMN "periodicity",
ADD COLUMN     "periodicity" "Periodicity",
ALTER COLUMN "donor_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
