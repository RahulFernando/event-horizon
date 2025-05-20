/*
  Warnings:

  - You are about to drop the column `default` on the `addresses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "default",
ADD COLUMN     "is_default" BOOLEAN DEFAULT true;
