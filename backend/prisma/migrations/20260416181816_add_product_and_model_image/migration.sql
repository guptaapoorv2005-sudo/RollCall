/*
  Warnings:

  - You are about to drop the column `uploadedImages` on the `Project` table. All the data in the column will be lost.
  - Added the required column `modelImage` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImage` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "uploadedImages",
ADD COLUMN     "modelImage" TEXT NOT NULL,
ADD COLUMN     "productImage" TEXT NOT NULL;
