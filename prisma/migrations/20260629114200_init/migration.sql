/*
  Warnings:

  - Added the required column `creatorLink` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docLink` to the `DocumentCollaborator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "creatorLink" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DocumentCollaborator" ADD COLUMN     "docLink" TEXT NOT NULL;
