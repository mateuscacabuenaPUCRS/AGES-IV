/*
  Warnings:

  - You are about to drop the column `donor_id` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `created_by` to the `campaigns` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `campaigns` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_donor_id_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "donor_id",
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "current_amount" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
