-- DropForeignKey
ALTER TABLE "read_receipts" DROP CONSTRAINT "read_receipts_participant_id_fkey";

-- AddForeignKey
ALTER TABLE "read_receipts" ADD CONSTRAINT "read_receipts_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "conversation_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
