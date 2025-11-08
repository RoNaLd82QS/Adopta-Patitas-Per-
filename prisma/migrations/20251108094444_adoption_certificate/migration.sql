/*
  Warnings:

  - A unique constraint covering the columns `[petId,adopterEmail]` on the table `Adoption` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AdoptionCertificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adoptionId" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "bookImageUrl" TEXT,
    "signatureUrl" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdoptionCertificate_adoptionId_fkey" FOREIGN KEY ("adoptionId") REFERENCES "Adoption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionCertificate_adoptionId_key" ON "AdoptionCertificate"("adoptionId");

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionCertificate_certificateNumber_key" ON "AdoptionCertificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "AdoptionCertificate_certificateNumber_idx" ON "AdoptionCertificate"("certificateNumber");

-- CreateIndex
CREATE INDEX "AdoptionCertificate_issuedAt_idx" ON "AdoptionCertificate"("issuedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Adoption_petId_adopterEmail_key" ON "Adoption"("petId", "adopterEmail");
