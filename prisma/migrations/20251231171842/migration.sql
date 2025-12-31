/*
  Warnings:

  - You are about to drop the column `onborading` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onborading",
ADD COLUMN     "onboradingCompleted" BOOLEAN NOT NULL DEFAULT false;
