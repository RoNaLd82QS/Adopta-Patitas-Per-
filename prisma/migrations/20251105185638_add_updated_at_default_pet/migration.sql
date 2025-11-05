/*
  Warnings:

  - You are about to drop the `Certificate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Publication` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReportLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Certificate_number_key";

-- DropIndex
DROP INDEX "Certificate_adoptionId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Certificate";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Publication";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ReportLog";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "lastName" TEXT,
    "birthDate" DATETIME,
    "address" TEXT,
    "district" TEXT,
    "province" TEXT,
    "dni" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adoption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "adopterName" TEXT NOT NULL,
    "adopterEmail" TEXT NOT NULL,
    "adopterPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Adoption_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Adoption" ("adopterEmail", "adopterName", "adopterPhone", "createdAt", "id", "petId", "status", "updatedAt") SELECT "adopterEmail", "adopterName", "adopterPhone", "createdAt", "id", "petId", "status", "updatedAt" FROM "Adoption";
DROP TABLE "Adoption";
ALTER TABLE "new_Adoption" RENAME TO "Adoption";
CREATE INDEX "Adoption_petId_idx" ON "Adoption"("petId");
CREATE INDEX "Adoption_adopterEmail_idx" ON "Adoption"("adopterEmail");
CREATE TABLE "new_Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "ageMonths" INTEGER NOT NULL,
    "weightKg" REAL,
    "description" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pet" ("ageMonths", "createdAt", "description", "id", "name", "photoUrl", "sex", "species", "weightKg") SELECT "ageMonths", "createdAt", "description", "id", "name", "photoUrl", "sex", "species", "weightKg" FROM "Pet";
DROP TABLE "Pet";
ALTER TABLE "new_Pet" RENAME TO "Pet";
CREATE INDEX "Pet_createdAt_idx" ON "Pet"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
