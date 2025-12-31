/*
  Warnings:

  - You are about to drop the column `onboradingCompleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboradingCompleted",
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;
