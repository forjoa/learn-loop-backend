/*
  Warnings:

  - You are about to drop the column `created_at` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `chat_member` table. All the data in the column will be lost.
  - Made the column `topic_id` on table `chat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_topic_id_fkey";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "created_at",
DROP COLUMN "type",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "topic_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "chat_member" DROP COLUMN "joined_at",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
