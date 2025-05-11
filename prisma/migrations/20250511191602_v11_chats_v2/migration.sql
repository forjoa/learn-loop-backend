/*
  Warnings:

  - You are about to drop the column `createdAt` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `topicId` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `chat_member` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `chat_member` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chat_member` table. All the data in the column will be lost.
  - You are about to drop the column `chatId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chat_id,user_id]` on the table `chat_member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chat_id` to the `chat_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chat_id` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_topicId_fkey";

-- DropForeignKey
ALTER TABLE "chat_member" DROP CONSTRAINT "chat_member_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat_member" DROP CONSTRAINT "chat_member_userId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_senderId_fkey";

-- DropIndex
DROP INDEX "chat_member_chatId_userId_key";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "createdAt",
DROP COLUMN "topicId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "topic_id" TEXT;

-- AlterTable
ALTER TABLE "chat_member" DROP COLUMN "chatId",
DROP COLUMN "joinedAt",
DROP COLUMN "userId",
ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "message" DROP COLUMN "chatId",
DROP COLUMN "senderId",
ADD COLUMN     "chat_id" TEXT NOT NULL,
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "chat_member_chat_id_user_id_key" ON "chat_member"("chat_id", "user_id");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_member" ADD CONSTRAINT "chat_member_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_member" ADD CONSTRAINT "chat_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
