/*
  Warnings:

  - You are about to drop the column `editorToken` on the `DocumentShareLink` table. All the data in the column will be lost.
  - You are about to drop the column `viewerToken` on the `DocumentShareLink` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `DocumentShareLink` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `DocumentShareLink` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DocumentShareLink_editorToken_idx";

-- DropIndex
DROP INDEX "DocumentShareLink_editorToken_key";

-- DropIndex
DROP INDEX "DocumentShareLink_viewerToken_idx";

-- DropIndex
DROP INDEX "DocumentShareLink_viewerToken_key";

-- AlterTable
ALTER TABLE "DocumentShareLink" DROP COLUMN "editorToken",
DROP COLUMN "viewerToken",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShareLink_token_key" ON "DocumentShareLink"("token");

-- CreateIndex
CREATE INDEX "DocumentShareLink_token_idx" ON "DocumentShareLink"("token");
