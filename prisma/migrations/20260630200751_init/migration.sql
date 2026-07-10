-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "creatorLink" DROP NOT NULL,
ALTER COLUMN "content" SET DEFAULT '\x'::bytea;

-- AlterTable
ALTER TABLE "DocumentVersion" ALTER COLUMN "content" SET DEFAULT '\x'::bytea;
