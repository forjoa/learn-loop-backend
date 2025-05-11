/*
  Warnings:

  - You are about to drop the column `postId` on the `file` table. All the data in the column will be lost.
  - Added the required column `post_id` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "postId",
ADD COLUMN     "post_id" INTEGER NOT NULL;
