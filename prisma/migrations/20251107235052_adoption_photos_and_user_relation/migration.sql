-- CreateTable
CREATE TABLE "AdoptionPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adoptionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AdoptionPhoto_adoptionId_fkey" FOREIGN KEY ("adoptionId") REFERENCES "Adoption" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Adoption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "userId" TEXT,
    "adopterName" TEXT NOT NULL,
    "adopterEmail" TEXT NOT NULL,
    "adopterPhone" TEXT,
    "address" TEXT,
    "district" TEXT,
    "province" TEXT,
    "houseType" TEXT,
    "hasKids" BOOLEAN,
    "hasOtherPets" BOOLEAN,
    "motivation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Adoption_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Adoption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Adoption" ("adopterEmail", "adopterName", "adopterPhone", "createdAt", "id", "petId", "status", "updatedAt") SELECT "adopterEmail", "adopterName", "adopterPhone", "createdAt", "id", "petId", "status", "updatedAt" FROM "Adoption";
DROP TABLE "Adoption";
ALTER TABLE "new_Adoption" RENAME TO "Adoption";
CREATE INDEX "Adoption_petId_idx" ON "Adoption"("petId");
CREATE INDEX "Adoption_adopterEmail_idx" ON "Adoption"("adopterEmail");
CREATE INDEX "Adoption_userId_idx" ON "Adoption"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AdoptionPhoto_adoptionId_idx" ON "AdoptionPhoto"("adoptionId");
