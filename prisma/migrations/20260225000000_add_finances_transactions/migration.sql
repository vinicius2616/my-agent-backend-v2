-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finances";

-- CreateEnum (finances.TransactionType)
CREATE TYPE "finances"."TransactionType" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateEnum (finances.TransactionCategory)
CREATE TYPE "finances"."TransactionCategory" AS ENUM ('alimentacao', 'transporte', 'saude', 'educacao', 'lazer', 'outros');

-- CreateTable (finances.transactions)
CREATE TABLE "finances"."transactions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "finances"."TransactionType" NOT NULL,
    "category" "finances"."TransactionCategory" NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "installment_number" INTEGER,
    "total_installments" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "finances_transactions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "finances_transactions_user_id_idx" ON "finances"."transactions"("user_id");

ALTER TABLE "finances"."transactions" ADD CONSTRAINT "finances_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
