/*
  Warnings:

  - The `content` column on the `DocumentVersion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "content" SET DEFAULT '\x'::bytea;

-- AlterTable
ALTER TABLE "DocumentVersion" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA DEFAULT '\x'::bytea;
