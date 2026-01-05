/*
  Warnings:

  - You are about to drop the column `dateEnd` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `dateStart` on the `events` table. All the data in the column will be lost.
  - Added the required column `date_end` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_start` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "dateEnd",
DROP COLUMN "dateStart",
ADD COLUMN     "date_end" DATE NOT NULL,
ADD COLUMN     "date_start" DATE NOT NULL;
