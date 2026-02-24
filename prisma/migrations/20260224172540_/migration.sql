-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "calendar";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dashboard";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finances";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "reminders";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "whatsapp";

-- AlterTable
ALTER TABLE "auth"."accounts" RENAME CONSTRAINT "auth_accounts_pkey" TO "accounts_pkey";

-- AlterTable
ALTER TABLE "auth"."sessions" RENAME CONSTRAINT "auth_sessions_pkey" TO "sessions_pkey";

-- AlterTable
ALTER TABLE "auth"."verification" RENAME CONSTRAINT "auth_verification_pkey" TO "verification_pkey";

-- AlterTable
ALTER TABLE "users"."users" RENAME CONSTRAINT "users_users_pkey" TO "users_pkey";

-- RenameForeignKey
ALTER TABLE "auth"."accounts" RENAME CONSTRAINT "auth_accounts_user_id_fkey" TO "accounts_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "auth"."sessions" RENAME CONSTRAINT "auth_sessions_user_id_fkey" TO "sessions_user_id_fkey";

-- RenameIndex
ALTER INDEX "auth"."auth_accounts_provider_id_account_id_key" RENAME TO "accounts_provider_id_account_id_key";

-- RenameIndex
ALTER INDEX "auth"."auth_accounts_user_id_idx" RENAME TO "accounts_user_id_idx";

-- RenameIndex
ALTER INDEX "auth"."auth_sessions_token_key" RENAME TO "sessions_token_key";

-- RenameIndex
ALTER INDEX "auth"."auth_sessions_user_id_idx" RENAME TO "sessions_user_id_idx";

-- RenameIndex
ALTER INDEX "users"."users_users_email_key" RENAME TO "users_email_key";
