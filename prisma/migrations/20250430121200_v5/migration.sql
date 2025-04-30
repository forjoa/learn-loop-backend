/*
  Warnings:

  - You are about to drop the column `topic_id` on the `file` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_topic_id_fkey";

-- AlterTable
ALTER TABLE "file" DROP COLUMN "topic_id",
ADD COLUMN     "post_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
