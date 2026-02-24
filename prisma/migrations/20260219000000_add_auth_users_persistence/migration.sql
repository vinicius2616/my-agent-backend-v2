-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

CREATE SCHEMA IF NOT EXISTS "users";

-- CreateTable (users.users)
CREATE TABLE "users"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_users_email_key" ON "users"."users"("email");

-- CreateTable (auth.sessions)
CREATE TABLE "auth"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "auth_sessions_token_key" ON "auth"."sessions"("token");

CREATE INDEX "auth_sessions_user_id_idx" ON "auth"."sessions"("user_id");

ALTER TABLE "auth"."sessions" ADD CONSTRAINT "auth_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable (auth.accounts)
CREATE TABLE "auth"."accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "password" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "access_token_expires_at" TIMESTAMP(3),
    "refresh_token_expires_at" TIMESTAMP(3),
    "scope" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "auth_accounts_provider_id_account_id_key" ON "auth"."accounts"("provider_id", "account_id");

CREATE INDEX "auth_accounts_user_id_idx" ON "auth"."accounts"("user_id");

ALTER TABLE "auth"."accounts" ADD CONSTRAINT "auth_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable (auth.verification)
CREATE TABLE "auth"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "auth_verification_pkey" PRIMARY KEY ("id")
);
