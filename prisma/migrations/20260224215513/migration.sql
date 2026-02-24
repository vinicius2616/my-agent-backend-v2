-- AlterTable
ALTER TABLE "finances"."transactions" RENAME CONSTRAINT "finances_transactions_pkey" TO "transactions_pkey";

-- RenameForeignKey
ALTER TABLE "finances"."transactions" RENAME CONSTRAINT "finances_transactions_user_id_fkey" TO "transactions_user_id_fkey";

-- RenameIndex
ALTER INDEX "finances"."finances_transactions_user_id_idx" RENAME TO "transactions_user_id_idx";
