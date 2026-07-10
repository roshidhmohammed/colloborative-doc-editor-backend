/*
  Warnings:

  - You are about to drop the column `creatorLink` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `docLink` on the `DocumentCollaborator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "creatorLink";

-- AlterTable
ALTER TABLE "DocumentCollaborator" DROP COLUMN "docLink";
