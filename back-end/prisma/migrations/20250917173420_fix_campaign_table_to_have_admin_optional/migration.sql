-- DropForeignKey
ALTER TABLE "campaigns" DROP CONSTRAINT "campaigns_admin_id_fkey";

-- AlterTable
ALTER TABLE "campaigns" ALTER COLUMN "admin_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
