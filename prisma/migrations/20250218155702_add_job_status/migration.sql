-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'ACTIVE', 'COMPLETED');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'PENDING';
