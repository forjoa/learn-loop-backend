/*
  Warnings:

  - You are about to drop the column `post_id` on the `file` table. All the data in the column will be lost.
  - Added the required column `postId` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "post_id",
ADD COLUMN     "postId" INTEGER NOT NULL;
