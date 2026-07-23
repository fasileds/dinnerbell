/*
  Warnings:

  - You are about to drop the column `coverImage` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `restorantId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_menuId_fkey";

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "coverImage",
DROP COLUMN "restorantId",
DROP COLUMN "title";

-- DropTable
DROP TABLE "Order";
