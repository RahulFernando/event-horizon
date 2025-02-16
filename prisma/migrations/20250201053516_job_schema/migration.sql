-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "gig_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "pricing_tier_tiered_id" TEXT,
    "pricing_tier_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "jobs_gig_id_key" ON "jobs"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_event_id_key" ON "jobs"("event_id");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_pricing_tier_id_pricing_tier_tiered_id_fkey" FOREIGN KEY ("pricing_tier_id", "pricing_tier_tiered_id") REFERENCES "pricing_tiers"("id", "tiered_id") ON DELETE SET NULL ON UPDATE CASCADE;
