/*
  Warnings:

  - You are about to drop the column `rate` on the `user_ratings` table. All the data in the column will be lost.
  - Added the required column `rating` to the `user_ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_ratings" DROP COLUMN "rate",
ADD COLUMN     "rating" INTEGER NOT NULL;
