/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_receiver_id_fkey";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "receiver_id";
