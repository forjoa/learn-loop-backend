/*
  Warnings:

  - You are about to drop the column `user_id` on the `file` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_user_id_fkey";

-- AlterTable
ALTER TABLE "file" DROP COLUMN "user_id";
