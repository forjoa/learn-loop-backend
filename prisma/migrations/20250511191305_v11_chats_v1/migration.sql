/*
  Warnings:

  - You are about to drop the column `created_at` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `topic_id` on the `chat` table. All the data in the column will be lost.
  - You are about to drop the column `chat_id` on the `chat_member` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `chat_member` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `chat_member` table. All the data in the column will be lost.
  - You are about to drop the column `chat_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `_messageTouser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[chatId,userId]` on the table `chat_member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `chat_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `chat_member` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chatId` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_messageTouser" DROP CONSTRAINT "_messageTouser_A_fkey";

-- DropForeignKey
ALTER TABLE "_messageTouser" DROP CONSTRAINT "_messageTouser_B_fkey";

-- DropForeignKey
ALTER TABLE "chat" DROP CONSTRAINT "chat_topic_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_member" DROP CONSTRAINT "chat_member_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "chat_member" DROP CONSTRAINT "chat_member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_sender_id_fkey";

-- DropIndex
DROP INDEX "chat_member_chat_id_user_id_key";

-- AlterTable
ALTER TABLE "chat" DROP COLUMN "created_at",
DROP COLUMN "topic_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "topicId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'GROUP';

-- AlterTable
ALTER TABLE "chat_member" DROP COLUMN "chat_id",
DROP COLUMN "joined_at",
DROP COLUMN "user_id",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "message" DROP COLUMN "chat_id",
DROP COLUMN "created_at",
DROP COLUMN "sender_id",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "_messageTouser";

-- CreateIndex
CREATE UNIQUE INDEX "chat_member_chatId_userId_key" ON "chat_member"("chatId", "userId");

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_member" ADD CONSTRAINT "chat_member_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_member" ADD CONSTRAINT "chat_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
