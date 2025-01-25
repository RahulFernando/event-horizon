-- CreateEnum
CREATE TYPE "PricingModelType" AS ENUM ('FIXED', 'HOURLY_RATE', 'TIERED');

-- CreateTable
CREATE TABLE "pricing_models" (
    "id" TEXT NOT NULL,
    "type" "PricingModelType" NOT NULL DEFAULT 'FIXED',
    "gig_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "pricing_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fixed_rates" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pricing_model_id" TEXT NOT NULL,

    CONSTRAINT "fixed_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hourly_rates" (
    "id" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "pricing_model_id" TEXT NOT NULL,

    CONSTRAINT "hourly_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiereds" (
    "id" TEXT NOT NULL,
    "pricing_model_id" TEXT NOT NULL,

    CONSTRAINT "tiereds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_tiers" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "tiered_id" TEXT NOT NULL,

    CONSTRAINT "pricing_tiers_pkey" PRIMARY KEY ("id","tiered_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pricing_models_gig_id_key" ON "pricing_models"("gig_id");

-- CreateIndex
CREATE UNIQUE INDEX "fixed_rates_pricing_model_id_key" ON "fixed_rates"("pricing_model_id");

-- CreateIndex
CREATE UNIQUE INDEX "hourly_rates_pricing_model_id_key" ON "hourly_rates"("pricing_model_id");

-- CreateIndex
CREATE UNIQUE INDEX "tiereds_pricing_model_id_key" ON "tiereds"("pricing_model_id");

-- AddForeignKey
ALTER TABLE "pricing_models" ADD CONSTRAINT "pricing_models_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_rates" ADD CONSTRAINT "fixed_rates_pricing_model_id_fkey" FOREIGN KEY ("pricing_model_id") REFERENCES "pricing_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hourly_rates" ADD CONSTRAINT "hourly_rates_pricing_model_id_fkey" FOREIGN KEY ("pricing_model_id") REFERENCES "pricing_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiereds" ADD CONSTRAINT "tiereds_pricing_model_id_fkey" FOREIGN KEY ("pricing_model_id") REFERENCES "pricing_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_tiers" ADD CONSTRAINT "pricing_tiers_tiered_id_fkey" FOREIGN KEY ("tiered_id") REFERENCES "tiereds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
