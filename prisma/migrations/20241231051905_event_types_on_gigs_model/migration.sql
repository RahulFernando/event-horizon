/*
  Warnings:

  - You are about to drop the column `event_type_id` on the `gigs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "gigs" DROP CONSTRAINT "gigs_event_type_id_fkey";

-- AlterTable
ALTER TABLE "gigs" DROP COLUMN "event_type_id";

-- CreateTable
CREATE TABLE "event_types_on_gigs" (
    "gig_id" TEXT NOT NULL,
    "event_type_id" TEXT NOT NULL,

    CONSTRAINT "event_types_on_gigs_pkey" PRIMARY KEY ("gig_id","event_type_id")
);

-- AddForeignKey
ALTER TABLE "event_types_on_gigs" ADD CONSTRAINT "event_types_on_gigs_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_types_on_gigs" ADD CONSTRAINT "event_types_on_gigs_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
