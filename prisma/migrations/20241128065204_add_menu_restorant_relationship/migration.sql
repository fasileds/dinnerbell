-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "restorantId" TEXT NOT NULL DEFAULT '17e4d7f2-2ae9-4e20-83ef-1a8e30786076';

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restorantId_fkey" FOREIGN KEY ("restorantId") REFERENCES "Restorant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
