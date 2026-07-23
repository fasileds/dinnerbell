/*
  Warnings:

  - You are about to drop the column `logo` on the `Restorant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restorantId_fkey";

-- AlterTable
ALTER TABLE "Restorant" DROP COLUMN "logo";
