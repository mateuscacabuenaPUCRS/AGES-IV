/*
  Warnings:

  - You are about to drop the column `admin_id` on the `campaigns` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_admin_id_fkey";

-- AlterTable
ALTER TABLE "campaigns" DROP COLUMN "admin_id";
