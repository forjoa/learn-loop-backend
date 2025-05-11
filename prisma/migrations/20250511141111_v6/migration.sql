-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_post_id_fkey";

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_id_fkey" FOREIGN KEY ("id") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
