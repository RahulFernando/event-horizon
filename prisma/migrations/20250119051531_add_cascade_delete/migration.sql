-- DropForeignKey
ALTER TABLE "event_types_on_gigs" DROP CONSTRAINT "event_types_on_gigs_event_type_id_fkey";

-- DropForeignKey
ALTER TABLE "event_types_on_gigs" DROP CONSTRAINT "event_types_on_gigs_gig_id_fkey";

-- DropForeignKey
ALTER TABLE "fixed_rates" DROP CONSTRAINT "fixed_rates_pricing_model_id_fkey";

-- DropForeignKey
ALTER TABLE "hourly_rates" DROP CONSTRAINT "hourly_rates_pricing_model_id_fkey";

-- DropForeignKey
ALTER TABLE "pricing_models" DROP CONSTRAINT "pricing_models_gig_id_fkey";

-- DropForeignKey
ALTER TABLE "pricing_tiers" DROP CONSTRAINT "pricing_tiers_tiered_id_fkey";

-- DropForeignKey
ALTER TABLE "tiereds" DROP CONSTRAINT "tiereds_pricing_model_id_fkey";

-- AddForeignKey
ALTER TABLE "event_types_on_gigs" ADD CONSTRAINT "event_types_on_gigs_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_types_on_gigs" ADD CONSTRAINT "event_types_on_gigs_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_models" ADD CONSTRAINT "pricing_models_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_rates" ADD CONSTRAINT "fixed_rates_pricing_model_id_fkey" FOREIGN KEY ("pricing_model_id") REFERENCES "pricing_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hourly_rates" ADD CONSTRAINT "hourly_rates_pricing_model_id_fkey" FOREIGN KEY ("pricing_model_id") REFERENCES "pricing_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiereds" ADD CONSTRAINT "tiereds_pricing_model_id_fkey" FOREIGN KEY ("pricing_model_id") REFERENCES "pricing_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_tiers" ADD CONSTRAINT "pricing_tiers_tiered_id_fkey" FOREIGN KEY ("tiered_id") REFERENCES "tiereds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
