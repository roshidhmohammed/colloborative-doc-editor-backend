-- CreateTable
CREATE TABLE "DocumentShareLink" (
    "id" TEXT NOT NULL,
    "editorToken" TEXT NOT NULL,
    "viewerToken" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShareLink_editorToken_key" ON "DocumentShareLink"("editorToken");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentShareLink_viewerToken_key" ON "DocumentShareLink"("viewerToken");

-- CreateIndex
CREATE INDEX "DocumentShareLink_editorToken_idx" ON "DocumentShareLink"("editorToken");

-- CreateIndex
CREATE INDEX "DocumentShareLink_viewerToken_idx" ON "DocumentShareLink"("viewerToken");

-- CreateIndex
CREATE INDEX "DocumentShareLink_documentId_idx" ON "DocumentShareLink"("documentId");

-- CreateIndex
CREATE INDEX "DocumentShareLink_createdById_idx" ON "DocumentShareLink"("createdById");

-- AddForeignKey
ALTER TABLE "DocumentShareLink" ADD CONSTRAINT "DocumentShareLink_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentShareLink" ADD CONSTRAINT "DocumentShareLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
