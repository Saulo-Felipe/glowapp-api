-- AlterTable
ALTER TABLE "public"."Company" ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."EmailOTPSession" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailOTPSession_pkey" PRIMARY KEY ("id")
);
