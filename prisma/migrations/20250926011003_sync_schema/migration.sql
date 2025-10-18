/*
  Warnings:

  - Added the required column `updatedAt` to the `DonationMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FollowUp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FollowUpPhoto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DonationMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bankName" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "cci" TEXT,
    "logoUrl" TEXT,
    "yapeQrUrl" TEXT,
    "plinQrUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_DonationMethod" ("account", "bankName", "cci", "createdAt", "id", "logoUrl", "plinQrUrl", "yapeQrUrl") SELECT "account", "bankName", "cci", "createdAt", "id", "logoUrl", "plinQrUrl", "yapeQrUrl" FROM "DonationMethod";
DROP TABLE "DonationMethod";
ALTER TABLE "new_DonationMethod" RENAME TO "DonationMethod";
CREATE INDEX "DonationMethod_createdAt_idx" ON "DonationMethod"("createdAt");
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "bannerUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Event" ("bannerUrl", "createdAt", "date", "description", "id", "location", "published", "title") SELECT "bannerUrl", "createdAt", "date", "description", "id", "location", "published", "title" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE INDEX "Event_date_idx" ON "Event"("date");
CREATE TABLE "new_FollowUp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "adopterName" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FollowUp_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FollowUp" ("adopterName", "createdAt", "id", "notes", "petId") SELECT "adopterName", "createdAt", "id", "notes", "petId" FROM "FollowUp";
DROP TABLE "FollowUp";
ALTER TABLE "new_FollowUp" RENAME TO "FollowUp";
CREATE INDEX "FollowUp_petId_idx" ON "FollowUp"("petId");
CREATE TABLE "new_FollowUpPhoto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followUpId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FollowUpPhoto_followUpId_fkey" FOREIGN KEY ("followUpId") REFERENCES "FollowUp" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FollowUpPhoto" ("createdAt", "followUpId", "id", "url") SELECT "createdAt", "followUpId", "id", "url" FROM "FollowUpPhoto";
DROP TABLE "FollowUpPhoto";
ALTER TABLE "new_FollowUpPhoto" RENAME TO "FollowUpPhoto";
CREATE INDEX "FollowUpPhoto_followUpId_idx" ON "FollowUpPhoto"("followUpId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "passwordHash", "role") SELECT "createdAt", "email", "id", "name", "passwordHash", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
