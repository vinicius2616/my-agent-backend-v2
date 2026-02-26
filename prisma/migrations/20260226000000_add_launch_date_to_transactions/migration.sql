-- AlterTable: add launch_date to finances.transactions (NOT NULL; existing rows get created_at as default)
ALTER TABLE "finances"."transactions" ADD COLUMN "launch_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove default so new inserts must provide launch_date (Prisma will send it)
ALTER TABLE "finances"."transactions" ALTER COLUMN "launch_date" DROP DEFAULT;
