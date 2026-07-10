/*
  Warnings:

  - The `content` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `creatorLink` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "creatorLink" TEXT NOT NULL,
DROP COLUMN "content",
ADD COLUMN     "content" BYTEA;
