-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "foodInspectionNumber" TEXT,
ADD COLUMN     "isAggent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOwner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nameOffAgnet" TEXT NOT NULL DEFAULT ' ',
ADD COLUMN     "ownerIdNumber" TEXT,
ADD COLUMN     "restaurantName" TEXT;
