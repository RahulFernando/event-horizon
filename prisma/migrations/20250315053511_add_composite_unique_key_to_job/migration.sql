/*
  Warnings:

  - A unique constraint covering the columns `[gig_id,event_id]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "jobs_event_id_key";

-- DropIndex
DROP INDEX "jobs_gig_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "jobs_gig_id_event_id_key" ON "jobs"("gig_id", "event_id");
