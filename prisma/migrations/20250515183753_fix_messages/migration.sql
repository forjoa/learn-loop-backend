/*
  Warnings:

  - You are about to drop the column `userId` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_userId_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "userId";
