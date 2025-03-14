-- CreateTable
CREATE TABLE "user_ratings" (
    "id" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "gig_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "user_ratings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "gigs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
